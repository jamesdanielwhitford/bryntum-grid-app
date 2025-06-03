const gridProps = {
    columns : [
        { text : 'Name', field : 'name', flex : 2 },
        { text : 'Age', field : 'age', width : 100, type : 'number' },
        { text : 'City', field : 'city', flex : 1 },
        { text : 'Food', field : 'food', flex : 1 },
        {
            text  : 'Color',
            field : 'color',
            flex  : 1,
            renderer({ cellElement, value }) {
                // set the color based on the value (e.g. "Red" should be red)
                cellElement.style.color = value;
                return value;
            }
        }
    ],

    data : [
        {
            id        : 1,
            name      : 'Don A Taylor',
            firstName : 'Don',
            surName   : 'Taylor',
            city      : 'Dubai',
            team      : 'Paris Tigers',
            age       : 30,
            food      : 'Salad',
            color     : 'Black'
        },
        {
            id        : 2,
            name      : 'John B Adams',
            firstName : 'John',
            surName   : 'Adams',
            city      : 'Paris',
            team      : 'Washington Horses',
            age       : 64,
            food      : 'Bolognese',
            color     : 'Orange'
        },
        {
            id        : 3,
            name      : 'Doug C Jones',
            firstName : 'Doug',
            surName   : 'Jones',
            city      : 'Stockholm',
            team      : 'New York Hens',
            age       : 30,
            food      : 'Pancake',
            color     : 'Pink'
        },
        {
            id        : 4,
            name      : 'James D Davis',
            firstName : 'James',
            surName   : 'Davis',
            city      : 'Barcelona',
            team      : 'Dubai Lions',
            age       : 87,
            food      : 'Pancake',
            color     : 'Green'
        },
        {
            id        : 5,
            name      : 'Mike E Johnson',
            firstName : 'Mike',
            surName   : 'Johnson',
            city      : 'Dubai',
            team      : 'New York Roosters',
            age       : 14,
            food      : 'Pancake',
            color     : 'Green'
        },
        {
            id        : 6,
            name      : 'Don F Johnson',
            firstName : 'Don',
            surName   : 'Johnson',
            city      : 'Dubai',
            team      : 'Paris Tigers',
            age       : 18,
            food      : 'Fish n chips',
            color     : 'Red'
        },
        {
            id        : 7,
            name      : 'Jane G McGregor',
            firstName : 'Jane',
            surName   : 'McGregor',
            city      : 'Stockholm',
            team      : 'Dubai Eagles',
            age       : 78,
            food      : 'Fish n chips',
            color     : 'Green'
        },
        {
            id        : 8,
            name      : 'Jane H Thomas',
            firstName : 'Jane',
            surName   : 'Thomas',
            city      : 'New York',
            team      : 'Paris Cougars',
            age       : 65,
            food      : 'Fish n chips',
            color     : 'Black'
        },
        {
            id        : 9,
            name      : 'Lisa I Anderson',
            firstName : 'Lisa',
            surName   : 'Anderson',
            city      : 'New York',
            team      : 'Stockholm Tigers',
            age       : 14,
            food      : 'Burger',
            color     : 'Orange'
        },
        {
            id        : 10,
            name      : 'Don J Thomas',
            firstName : 'Don',
            surName   : 'Thomas',
            city      : 'Stockholm',
            team      : 'Barcelona Cougars',
            age       : 45,
            food      : 'Salad',
            color     : 'Black'
        },
        {
            id        : 11,
            name      : 'Doug K Jackson',
            firstName : 'Doug',
            surName   : 'Jackson',
            city      : 'Barcelona',
            team      : 'Dubai Cats',
            age       : 16,
            food      : 'Fish n chips',
            color     : 'Red'
        },
        {
            id        : 12,
            name      : 'James L Ewans',
            firstName : 'James',
            surName   : 'Ewans',
            city      : 'Dubai',
            team      : 'Dubai Dogs',
            age       : 30,
            food      : 'Salad',
            color     : 'Black'
        },
        {
            id        : 13,
            name      : 'Jenny M Brown',
            firstName : 'Jenny',
            surName   : 'Brown',
            city      : 'Dubai',
            team      : 'Stockholm Eagles',
            age       : 56,
            food      : 'Waffles',
            color     : 'Orange'
        },
        {
            id        : 14,
            name      : 'Doug N Ewans',
            firstName : 'Doug',
            surName   : 'Ewans',
            city      : 'Barcelona',
            team      : 'New York Dogs',
            age       : 61,
            food      : 'Pancake',
            color     : 'Teal'
        },
        {
            id        : 15,
            name      : 'Mike O Ewans',
            firstName : 'Mike',
            surName   : 'Ewans',
            city      : 'Stockholm',
            team      : 'New York Roosters',
            age       : 78,
            food      : 'Burger',
            color     : 'Green'
        }
    ]
};

export { gridProps };
