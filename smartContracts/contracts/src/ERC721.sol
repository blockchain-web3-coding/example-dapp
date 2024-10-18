// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract TestNFT is ERC721 {
    using Strings for uint256;

    uint256 private _nextTokenId;

    event NFTMinted(address indexed to, uint256 indexed tokenId);

    constructor() ERC721("TestNFT", "TNT") {}

    function safeMint(address to) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        emit NFTMinted(to, tokenId);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (!_exists(tokenId)) revert("ERC721Metadata: URI query for nonexistent token");

        string memory name = string(abi.encodePacked('TestNFT #', tokenId.toString()));
        string memory description = "A test NFT with on-chain metadata";
        string memory image = generateImage(tokenId);

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(
                    bytes(
                        abi.encodePacked(
                            '{"name":"', name, '",',
                            '"description":"', description, '",',
                            '"image":"', image, '"}'
                        )
                    )
                )
            )
        );
    }

    function generateImage(uint256 tokenId) internal pure returns (string memory) {
        string memory svg = string(
            abi.encodePacked(
                '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
                '<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>',
                '<rect width="100%" height="100%" fill="black" />',
                '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">',
                'TestNFT #', tokenId.toString(),
                '</text>',
                '</svg>'
            )
        );
        return string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(bytes(svg))
            )
        );
    }

    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
