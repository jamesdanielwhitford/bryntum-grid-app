export const gridConfig = {
    // Enable features needed for editing
    cellEditFeature: true,
    filterFeature: true,
    sortFeature: true,
    
    // Add toolbar with add/remove buttons
    tbar: {
        items: [
            {
                type: 'button',
                text: 'Add',
                icon: 'b-fa b-fa-plus',
                color: 'b-green',
                onClick: ({ source: button }) => {
                    const grid = button.up('grid');
                    // Ensure all fields are initialized with valid values
                    const newRecord = {
                        name: 'New Person',  // Default name to satisfy NOT NULL constraint
                        age: null,
                        city: '',
                        food: '',
                        color: ''
                    };
                    
                    const addedRecord = grid.store.add(newRecord)[0];

                    // Start editing the name field of the new record immediately
                    if (addedRecord) {
                        grid.startEditing({
                            record: addedRecord,
                            field: 'name'
                        });
                    }
                }
            },
            {
                type: 'button',
                text: 'Remove Selected',
                icon: 'b-fa b-fa-trash',
                color: 'b-red',
                onClick: ({ source: button }) => {
                    const grid = button.up('grid');
                    grid.store.remove(grid.selectedRecords);
                }
            }
        ]
    },

    // Column definitions
    columns: [
        { 
            text: 'Name', 
            field: 'name', 
            flex: 2, 
            editor: true,
            required: true,  // Mark as required
            renderer: ({ value }) => value || '<empty>'  // Show placeholder for empty values
        },
        { 
            text: 'Age', 
            field: 'age', 
            width: 100, 
            type: 'number', 
            editor: true,
            min: 0,  // Prevent negative ages
            max: 150  // Reasonable maximum age
        },
        { 
            text: 'City', 
            field: 'city', 
            flex: 1, 
            editor: true,
            renderer: ({ value }) => value || ''
        },
        { 
            text: 'Food', 
            field: 'food', 
            flex: 1, 
            editor: true,
            renderer: ({ value }) => value || ''
        },
        {
            text: 'Color',
            field: 'color',
            flex: 1,
            editor: true,
            renderer({ cellElement, value }) {
                cellElement.style.color = value || 'inherit';
                return value || '';
            }
        }
    ],

    // Enable row selection
    selectionMode: {
        row: true,
        multiSelect: true
    },

    // Enable keyboard navigation
    keyMap: {
        enabled: true
    },

    // Responsive configuration
    responsiveLevels: {
        small: 400,
        normal: 600,
        big: 800
    },
    
    // Height setting
    height: '100%'
};
