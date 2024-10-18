import React, { useState, useEffect, useRef } from 'react';
import {
  EventListener as EventListenerClass,
  EventListenerConfig,
} from '../utils/eventListener';
import { TxDecoder } from '../utils/txDecoder';
import { ethers } from 'ethers';
//import { useAccount } from '../connectWallet/Provider';

const EventListener: React.FC = () => {
  // const { chainId } = useAccount();
  const [rpcUrl, setRpcUrl] = useState('');
  const [contractAddress, setContractAddress] = useState('');
  const [abi, setAbi] = useState('');
  const [intervalMs, setIntervalMs] = useState(5000);
  const [isListening, setIsListening] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [decodedLogs, setDecodedLogs] = useState<ethers.utils.LogDescription[]>(
    []
  );
  const eventListenerRef = useRef<EventListenerClass | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const txDecoderRef = useRef<TxDecoder | null>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const startListening = () => {
    if (!rpcUrl || !contractAddress || !abi) {
      alert('Please fill in all fields');
      return;
    }

    const parsedAbi = JSON.parse(abi);
    const config: EventListenerConfig = {
      rpcUrl,
      contractAddress,
      abi: parsedAbi,
      intervalMs,
    };

    txDecoderRef.current = new TxDecoder(parsedAbi);
    eventListenerRef.current = new EventListenerClass(config);
    eventListenerRef.current.start((events) => {
      const decodedEvents = txDecoderRef.current!.decodeLogs(events);
      setDecodedLogs((prevLogs) => [...prevLogs, ...decodedEvents]);
      setLogs((prevLogs) => [
        ...prevLogs,
        ...events.map((event) => JSON.stringify(event, null, 2)),
      ]);
    });

    setIsListening(true);
  };

  const stopListening = () => {
    if (eventListenerRef.current) {
      eventListenerRef.current.stop();
      setIsListening(false);
    }
  };

  const formatDecodedLog = (log: ethers.utils.LogDescription) => {
    return (
      `Event: ${log.name}\n` +
      `Args: ${JSON.stringify(
        log.args,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value),
        2
      )}`
    );
  };

  return (
    <div className="flex">
      <div className="w-1/3 pr-4">
        <input
          type="text"
          placeholder="RPC URL"
          value={rpcUrl}
          onChange={(e) => setRpcUrl(e.target.value)}
          className="w-full mb-2 p-2 bg-gray-800 text-white rounded"
        />
        <input
          type="text"
          placeholder="Contract Address"
          value={contractAddress}
          onChange={(e) => setContractAddress(e.target.value)}
          className="w-full mb-2 p-2 bg-gray-800 text-white rounded"
        />
        <textarea
          placeholder="Contract ABI (JSON format)"
          value={abi}
          onChange={(e) => setAbi(e.target.value)}
          className="w-full mb-2 p-2 bg-gray-800 text-white rounded"
          rows={5}
        />
        <input
          type="number"
          placeholder="Interval (ms)"
          value={intervalMs}
          onChange={(e) => setIntervalMs(Number(e.target.value))}
          className="w-full mb-2 p-2 bg-gray-800 text-white rounded"
        />
        <button
          onClick={isListening ? stopListening : startListening}
          className={`w-full p-2 rounded ${
            isListening
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-green-600 hover:bg-green-700'
          } text-white`}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
      </div>
      <div className="w-2/3 pl-4">
        <div className="bg-gray-800 p-4 rounded h-96 overflow-auto">
          {decodedLogs.map((log, index) => (
            <pre key={index} className="text-white text-sm mb-2">
              {formatDecodedLog(log)}
            </pre>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
};

export default EventListener;
