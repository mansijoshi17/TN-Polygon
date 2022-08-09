// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./StreamScheduler.sol";

contract StreamFactory is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _contractIds;
    mapping(uint256 => address) streamSchedulers;

    event StreamSchedulerCreated(uint256, address);

    /**
      Creates new stream scheduler contract
      @param cfa Superfluid cfa for the different networks
      @param host Superfluid host for the different networks
    */
    function createStreamScheduler(
        IConstantFlowAgreementV1 cfa,
        ISuperfluid host
    ) public {
        _contractIds.increment();
        uint256 newItemId = _contractIds.current();

        address _address = address(new StreamScheduler(cfa, host)); // Created Rent contract.
        streamSchedulers[newItemId] = address(_address);
        emit StreamSchedulerCreated(newItemId, _address);
    }
}
