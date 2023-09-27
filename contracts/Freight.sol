pragma solidity ^0.5.0;

contract freight {
    uint public deliveryCount = 0;

    struct Order {
        uint id;
        string name;
        string Address;
        string number;
        bool completed;
    }

    mapping(uint => Order) public orders;

    event orderCreated(
        uint id,
        string name,
        string Address,
        string number,
        bool completed
    );

    event orderCompleted(
         uint id,
         bool completed
    );

    function AddOrders(string memory _name, string memory _address, string memory _number) public {
        deliveryCount++;
        orders[deliveryCount] = Order(deliveryCount,_name,_address,_number,false);
        emit orderCreated(deliveryCount,_name,_address,_number,false);
    }

    constructor() public {
        AddOrders("deakin University is....", "221 Burwood Hwy, Burwood VIC 3125","(03) 9244 6100");
    }

    function toggleCompleted(uint _id) public {
        Order memory _order = orders[_id];
        _order.completed = !_order.completed;
        orders[_id] =  _order;
        emit orderCompleted(_id, _order.completed);
    }
}