// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MonkeysWithTypewriters is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Sentence {
        string text;
        address author;
    }

    mapping(uint256 => Sentence[]) public stories;

    constructor() ERC721("MonkeysWithTypewriters", "MWT") {}

    function addSentence(string memory _text, uint256 _tokenId) public {
        Sentence[] storage story = stories[_tokenId];
        story.push(Sentence(_text, msg.sender));
    }

    function mint() public returns (uint256) {
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _tokenIds.increment();

        return newItemId;
    }
}