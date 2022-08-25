// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {ISuperfluidToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluidToken.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./MoneyRouter.sol";

contract StreamFactory is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _contractIds;
    mapping(uint256 => address) streamSchedulers;

    event StreamSchedulerCreated(uint256, address);

    /**
      Creates new stream scheduler contract
      @param host Superfluid host for the different networks
    */
    function createStreamScheduler(ISuperfluid host) public {
        _contractIds.increment();
        uint256 newItemId = _contractIds.current();

        address _address = address(new MoneyRouter(host, msg.sender)); // Created Rent contract.
        streamSchedulers[newItemId] = address(_address);
        emit StreamSchedulerCreated(newItemId, _address);
    }
}
