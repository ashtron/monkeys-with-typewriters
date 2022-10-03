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
    mapping(uint256 => address) public lastSentenceAdders;

    error NotOwner();

    modifier onlyOwner(uint _tokenId, address _address) {
        require(ownerOf(_tokenId) == _address, "Only the NFT owner can add a new sentence.");
        _;
    }

    modifier onlyNewAdder(uint _tokenId, address _address) {
        require(lastSentenceAdders[_tokenId] != _address, "A different address must add the next sentence.");
        _;
    }

    constructor() ERC721("MonkeysWithTypewriters", "MWT") {}

    function addSentence(string memory _text, uint256 _tokenId) public onlyOwner(_tokenId, msg.sender) onlyNewAdder(_tokenId, msg.sender) {
        Sentence[] storage story = stories[_tokenId];
        story.push(Sentence(_text, msg.sender));
        lastSentenceAdders[_tokenId] = msg.sender;
    }

    function mint() public returns (uint256) {
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _tokenIds.increment();

        return newItemId;
    }
}