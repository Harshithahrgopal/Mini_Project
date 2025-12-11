// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract SimpleVoting {
    address public admin;
    bool public electionOngoing;

    // Track if a voter has voted (true means voted)
    mapping(address => bool) public hasVoted;

    // Candidate info struct
    struct Candidate {
        uint id;
        string name;
        uint wardNumber;
        uint voteCount;
    }

    // Candidate Id => Candidate
    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    // Events
    event VoteCast(address voter, uint candidateId);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier electionActive() {
        require(electionOngoing, "Election is not active");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function startElection() external onlyAdmin {
        electionOngoing = true;
    }

    function endElection() external onlyAdmin {
        electionOngoing = false;
    }

    // Admin adds candidates with their ward number (call once before election)
    function addCandidate(string calldata _name, uint _wardNumber) external onlyAdmin {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, _wardNumber, 0);
    }

    // Voter votes for a candidate, passing their ward number
    function vote(uint _candidateId, uint _voterWard) external electionActive {
        require(!hasVoted[msg.sender], "You have already voted");

        Candidate storage candidate = candidates[_candidateId];
        require(candidate.id != 0, "Invalid candidate");
        require(candidate.wardNumber == _voterWard, "Candidate not in your ward");

        hasVoted[msg.sender] = true;
        candidate.voteCount++;

        emit VoteCast(msg.sender, _candidateId);
    }

    // Read candidate details
    function getCandidate(uint _candidateId) external view returns (string memory, uint, uint) {
        Candidate storage c = candidates[_candidateId];
        require(c.id != 0, "Candidate does not exist");
        return (c.name, c.wardNumber, c.voteCount);
    }
}
