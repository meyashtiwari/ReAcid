pragma solidity ^0.5.0;

contract ReAcid {
    uint public recordCount = 0;

    struct Record {

        uint id;
        string name;
        string phoneNumber;
        string typeOfAcid;
    }

    mapping(uint => Record) public records;

    function createRecord(string memory _name, string memory _phoneNumber, string memory _typeOfAcid) public {
        recordCount++;
        records[recordCount] = Record(recordCount, _name, _phoneNumber, _typeOfAcid);
    }

    constructor() public {

        createRecord("Yash", "8920958278", "H2SO4");
    }
}