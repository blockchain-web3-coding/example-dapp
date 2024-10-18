// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract Test1155 is ERC1155 {
    using Strings for uint256;

    event TokenMinted(address indexed account, uint256 indexed id, uint256 amount);
    event TokensBatchMinted(address indexed to, uint256[] ids, uint256[] amounts);

    constructor() ERC1155("") {}

    function mint(address account, uint256 id, uint256 amount, bytes memory data) public {
        _mint(account, id, amount, data);
        emit TokenMinted(account, id, amount);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data) public {
        _mintBatch(to, ids, amounts, data);
        emit TokensBatchMinted(to, ids, amounts);
    }

    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        string memory name = string(abi.encodePacked('Test1155 #', tokenId.toString()));
        string memory description = "A test ERC1155 token with on-chain metadata";
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
                '<rect width="100%" height="100%" fill="blue" />',
                '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">',
                'Test1155 #', tokenId.toString(),
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
}
