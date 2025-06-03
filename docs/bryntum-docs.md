Displaying data in a Grid
Every Bryntum component uses Store data containers for holding data.

A store uses a Model as the blueprint for each row (called record) it holds.

In this section, the focus will be on the fundamental process of presenting data within the Grid. For a comprehensive understanding of the Store and its functionalities, refer to Using a store.

This section outlines the available approaches to populate a Grid with data, that includes three methods:

Using inline or preloaded data
Loading remote data over HTTP(S)
Responding to Store data requests
Using inline or preloaded data
If you have inline data, or data already fully loaded in a custom way, you can supply it directly when creating a grid:

JS
React
Vue
Angular
const App = props => {
    const [data, setData] = useState([
        { id : 1, name : 'Batman' },
        { id : 2, name : 'Wolverine' },
        ...
    ]);

    return <BryntumGrid data={data} />
}
Another option if you need to configure the store is to supply a store config object (for info on available configs, see API docs for Store):

JS
React
Vue
Angular
const App = props => {
    const [store, setStore] = useState({
        sorters : [
            { field : 'name' }      
        ],
        data : [
            { id : 1, name : 'Batman' },
            ...
        ] 
    });

    return <BryntumgRid store={store} />
}
A third option is to supply an already existing Store instance:

JS
React
Vue
Angular
const App = props => {
    const myStore = new Store({
       someConfig : "...",
       data : [
           { id : 1, name : 'Batman' },
           /*...*/
       ]
    });

    const [store, setStore] = useState(myStore);

    return <bryntum-grid store={store} />
}
Inline data is expected to be an array of JavaScript objects. If no model/fields are defined for the store more info the properties of the first entry in the array are used as fields (id and name in the examples above).

If the data is not available at configuration time, and you do not want to use the remote loading capabilities described below, you can load data any custom way you want and then plug it into the store later:

const grid = new Grid({
    columns : [/*...*/]
});

// Using native fetch to load data
const response = await fetch('backend/load.php');
const data = await response.json();

// Maybe do some custom processing before plugging into grids store
data.forEach((row, index) => {
    row.index = index;
    row.someValue = Math.random();
    /*...*/
});

// Plug it in as inline data
grid.store.data = data;
Loading remote data over HTTP(S)
The easiest way to load remote data is to use and AjaxStore. Provide it with a readUrl and it takes care of the loading. There are a few different ways to set it up. Either supply a store config containing a readUrl:

JS
React
Vue
Angular
const App = props => {
    const [store, setStore] = useState({
        // When Grid finds readUrl in the store config it will create an AjaxStore
        readUrl : 'backend/load.php',
        // Load upon creation
        autoLoad : true 
    });

    return <bryntum-grid store={store} />
}
Or create the store prior to creating the grid:

JS
React
Vue
Angular
const App = props => {
    const myStore = new AjaxStore({
        readUrl : 'backend/load.aspx'
    });

    return <bryntum-grid store={myStore} />
}
The data returned from the backend is expected to have the following format:

{
    "success" : true,
    "data" : [  
        { "id" : 1, "name" : "Batman" },
        { "..." : "..." }
    ]
}
Responding to Store data requests (advanced usage)
If you do not use an AjaxStore, and you need to use lazy loading, remote sorting, remote filtering and/or remote paging, there is a third option. If any of lazyLoad, remoteSort, remoteFilter or remotePaging configs are set to true on a non-AjaxStore, the store will request data when needed.

The lazy loading functionality has its own guide. For remote sorting, filtering and paging, please read on.

The requestData function will be called when the Store needs new data, which will happen:

for remoteSort, on a sort operation.
for remoteFilter, on a filter operation.
for remotePaging, when current page is changed.
When implementing this, it is expected that what is returned is an object with a data property containing the records requested. What is requested will be specified in the params object, which will differ depending on the source of the request.

For remotePaging, the params object will contain a page and a pageSize param. It is expected for the implementation of this function to provide a data property containing the number of records specified in the pageSize param starting from the specified page. It is also required, to include a total property which reflects the total amount of records available to load.

class MyStore extends Store {
   static configurable = {
       remotePaging : true    
   } 

   requestData({page, pageSize}){
      const start = (page - 1) * pageSize;
      const data = allRecords.splice(start, start + pageSize);

      return {
         data,
         total : allRecords.length
      }
   }
}
If remoteSort is active, the params object will contain a sorters param, containing a number of sorters objects. The sorter objects will look like this:

{
    "field": "name",
    "ascending": true
}
Use the sorters param to sort the data before returning:

const store = new Store({
   remoteSort   : true, 
   remotePaging : true,
   requestData({ sorters, page, pageSize }){
      const sortedRecords = [...allRecords];

      sorters?.forEach(sorter => sortedRecords.sort((a,b) => {
         const { field, ascending } = sorter;

         if (!ascending) {
             ([b, a] = [a, b]);
         }

         return a[field] > b[field] ? 1 : (a[field] < b[field] ? -1 : 0)
      });

      const start = (page - 1) * pageSize;
      const data = sortedRecords.splice(start, start + pageSize);

      return {
         data,
         total : allRecords.length
      }

   }
})
If remoteFilter is active, the params object will contain a filters param, containing a number of filter objects. The filter objects will look like this:

{
    "field": "country",
    "operator": "=",
    "value": "sweden",
    "caseSensitive": false
}
Use the filters to filter the data before returning:

const store = new Store({
   remoteFilter : true,
   remoteSort   : true,
   remotePaging : true,

   requestData({ filters, sorters, page, pageSize }){
      let filteredRecords = [...allRecords];

      filters?.forEach(filter => {
         const { field, operator, value, caseSensitive } = filter;

         if(operator === '='){
             filteredRecords = filteredRecords.filter(r => r[field] === value);
         }
         else {
             /// ... implement other filter operators
         }
      });

      sorters?.forEach(sorter => filteredRecords.sort((a,b) => {
         const { field, ascending } = sorter;

         if (!ascending) {
             ([b, a] = [a, b]);
         }

         return a[field] > b[field] ? 1 : (a[field] < b[field] ? -1 : 0)
      }));

      const start = (page - 1) * pageSize;
      const data = filteredRecords.splice(start, start + pageSize);

      return {
         data,
         total : filteredRecords.length
      }

   }
})
Framework 2-way binding
For some framework users, where the data property of the Grid has been bound to a state-monitored data source, implementing the requestData function is not a viable option. In these cases, it is better to add a listener to the requestData event instead.

The main difference is that a requestData event listener cannot return the data directly. Instead, the data property should be updated (which will be done by the framework), and if the Store is paged, the totalCount property be set (will not be done by the framework).

import { BryntumDemoHeader, BryntumGrid } from '@bryntum/grid-react';
import { useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const App = props => {
    const gridProps = {
        store : {
            remoteFilter: true,
            remoteSort: true,
            remotePaging: true,
        }
    }

    function App() {
        const gridRef = useRef<BryntumGrid>();

        // Data managed by Redux
        const data = useSelector((state : RootState) => state.data.rows);
        const total = useSelector((state: RootState) => state.data.total);
        const dispatch : AppDispatch = useDispatch();

        useEffect(() => {
            const grid = gridRef.current.instance;
            const store = grid.store as Store;

            // Listen to the Store's requestData function to be able to intercept data requests
            store.on({
                requestData({ page, pageSize, sorters, filters } : { page:number; pageSize:number; sorters:Array<any>; filters:Array<any> }) {
                    // dispatch is a Redux thing, and loadData is a Redux data slice
                    dispatch(loadData({ page, pageSize, sorters, filters }));
                }
            });

            store.loadPage(1, {});
        }, []);

        return (
            <BryntumGrid
                ref={gridRef}
                {...gridProps}
                data={data}
            />
        );
    }
}
Last modified on 2025-05-27 9:20:39


Using a Store
This guide shows how to manage records in a Store, for example how to retrieve records and how to sort or filter the store.

It assumes you have read the Displaying data guide, which has info on how to create a Store, populate it with data and how to use it with your component.

Store example
The store outlined in code below is referred to in the examples ahead in this guide:

const store = new Store({
    data : [
        { id : 1, name : 'Ms. Marvel', powers : 'Shapeshifting' },
        { id : 2, name : 'Black Widow', powers : 'Martial arts' },
        { id : 3, name : 'Captain Marvel', powers : 'Energy projection' },
        { id : 4, name : 'X-23', powers : 'Regeneration' },
        { id : 5, name : 'Mockingbird', powers : 'Martial arts' }
    ]
});
A store is a collection of Model instances, each known as a record, akin to a row in a Grid. The Model outlines the data structure, specifying the fields included in each record.

Auto-generated Model
If you do not specify any model, one will be created for you. The properties of the first record in your data will be turned into fields:

const store = new Store({
    data : [
        { name : 'Wolverine', powers : 'Regeneration' },
        { name : 'Deadpool', powers : 'Yes I have, great powers' }   
    ]
});
The code above will create a store with two records, based on a generated Model containing the two fields name and powers.

 Note that this approach is risky, if your backend for example uses a JSON serializer that optimizes away null values, or your rows have varying fields, the model might end up with an incorrect set of fields. For all but the very basic scenarios we recommend using a Custom data model (see below)
Custom data model
If you need more control over the fields a model contains, you have two options. If you do not need to reuse the Model, you can simply specify the fields when creating the store:

const store = new Store({
    fields : ['name', 'powers', 'affiliation'],
    data : [
        { name : 'Wolverine', powers : 'Regeneration' },
        /*...*/
    ]
});
You can also create a subclass of Model and define the fields you need on it:

class SuperHero extends Model {
    static fields = [
        'name', // this works too (name='Wolverine')
        { name : 'powers', defaultValue: 'String' }, // With default value
        { name : 'birthday', type : 'date', format : 'YYYY-MM-DD' }, // a date field
        { name : 'affiliation', readOnly : true } // Not editable
        ]
}

const store = new Store({
    modelClass : SuperHero,
    data: [
        { name : 'Wolverine', powers : 'Regeneration' },
        /*...*/
    ]
}); 
See the API docs for Model for more information on defining and mapping fields.

 When using a store, it is advisable to define your own custom model class or inline fields .
Retrieving records
A Store can be seen as a collection of records with functionality to manage them. To retrieve a record, it is easiest to do it using its index or id:

store.getAt(1); // Black Widow
store.getById(3); // Captain Marvel
There are also shortcuts to get the first or last record:

store.first; // Ms. Marvel
store.last; // Mockingbird
You can search for a single record:

store.find(record => record.name.startsWith('M')); // Ms. Marvel
store.findRecord('name', 'X-23'); // X-23, surprise
Or query for multiple:

store.query(record => record.name.startsWith('M')); // [Ms. Marvel, Mockingbird]
Counting the records in the Store
The Store can contain both "data" records, as well as UI-related records when used with a data grid (such as group header, and footer rows etc.). Depending on your application logic, you might be interested in different ways of counting (visible rows only, with or without filtered out results, etc.). The getCount lets you decide how to count the records.

// "Visible" records (as would be shonw in a Grid etc.), i.e. after filtering, including group 
// headers, excluding records in collapsed groups
const visibleRecords = store.count;

// Total records in the store, including records in collapsed groups and filtered out records, 
// excluding group headers (see the docs for getCount() for all options)
const allDataRecords = store.getCount({ collapsed : true, filteredOut : true }); 

// Include records that have been filtered out, 
// as well as any records inside collapsed groups or tree nodes.
const records = store.getCount({
    collapsed   : true,
    filteredOut : true
});

// All records, including group headers and filtered out records
const allRecords = store.getCount({
    all : true
});

// Including group headers + summary records
const records = store.getCount({
    headersFooters : true
});
Sorting
A Store can be sorted by a single field or by multiple fields. Sort can be specified at creation time using stores config:

const store = new Store({
    sorters : [
        { field : 'powers' }, // ascending
        { field : 'name', ascending : false } // descending
    ]
});
After creation it can be sorted as below:

store.sort('name'); // Sort by name, ascending, toggles on additional calls
store.sort('name', false); // Sort by name, descending

store.addSorter('powers'); // Also sort by powers
store.removeSorter('powers'); // Stop sorting by powers
Filtering
Filtering makes the store expose a subset of its records. When iterating or querying the store only this subset will be used. Examples on filtering:

store.filter('powers', 'Martial arts'); // Black Widow, Mockingbird

store.filter({
    property  : 'id',
    operatior : '<',
    value     : 4
}); // Ms. Marvel, Black Widow, Captain Marvel

store.clearFilters(); // Remove filters
Iterating over records
The records in the store can be iterated over in a couple of ways. Using for-of:

for (let record of store) {
    console.log(record.name);
}
Or by using forEach:

store.forEach(record => {
    console.log(record.name);
});
The stores implementation of forEach differs from the native arrays by allowing you to terminate the iteration by returning false.

Reactivity
Fields are turned into setters on the records, which makes them reactive. For example:

JS
React
Vue
Angular
// Grid data: [{ name : 'Wolverine', powers : 'Regeneration' }]
grid.gridInstance.store.first.name = 'Logan';
This will update the grid on the fly to update and display Logan instead of Wolverine.

CRUD operations
Adding records
You can easily add existing records or raw data:

store.add({ name : 'Scarlet Witch' });

// or

store.add(new Model({
    name   : 'Storm',
    powers : 'Weather'
}));
Same goes for insertion:

store.insert(0, { name : 'She-Hulk' });

// or

store.insert(0, new Model({
    name   : 'Medusa',
    powers : 'Hair'
}));
Removing records
Either retrieve a record and call Model#remove() or remove it using its id:

store.remove(1); // Removes Ms. Marvel

store.last.remove(); // Removes Mockingbird
Modifying records
Fields in a record are turned into setters which can be assigned to update the record, making it reactive. Doing so triggers events that updates the grid (if the store is used with a grid). To modify a record, simply retrieve it and set values:

store.last.name = 'Jennifer Walters';
To set multiple fields in a single go:

store.last.set({
    name   : 'Jennifer Walters',
    powers : 'Strength'
});
JSON
If you want to serialize the contents of a store, you can access the data from all of its records in JSON format:

 const jsonString = store.json;

// or

const jsonArray = store.toJSON();
To plug the JSON data back in later:

 store.json = jsonString;
or

 store.data = jsonString;



 Grid columns
This guide describes the basics on how to configure and manipulate grid columns.

Setting up columns
To configure which columns to use in a Grid you use the grid configurations columns property:

const grid = new Grid({
    columns : [
        { text : 'Name', field : 'name', flex : 1 },
        { text : 'City', field : 'city', width : 100 }
    ]
});
The snippet above shows a grid with two columns using minimal configuration:

text - Text to display in the column header
field - Data field from which column contents are fetched
flex - Proportional width, the width remaining after any fixed width columns is shared between flex columns
width - Fixed width, in pixels if nothing else is specified
Result:

LIVE DEMO

Column types
Grid supports different column types. These types affect how data in the column is formatted and edited. You specify which type a column has in its configuration object:

{ type : 'columntype', text : 'Header', ... } 
This snippet has one column per type:

const grid = new Grid({
    columns : [
        { type : 'rownumber' },
        { type : 'check', text : 'CheckColumn', field : 'done', flex : 1 },
        { type : 'date', text : 'DateColumn', field : 'start', flex : 1 },
        { type : 'number', text : 'NumberColumn', field : 'rank', flex : 1 },
        { type : 'percent', text : 'PercentColumn', field : 'percent', flex : 1 },
        { type : 'rating', text : 'RatingColumn', field : 'rating', flex : 1 },
        { type : 'template', text : 'TemplateColumn', field : 'city', flex : 1, template : ({value}) => `Lives in ${value}`},
        { type : 'widget', text : 'Widget', field : 'color', flex : 1, widgets : [ { type: 'button', cls: 'b-raised b-orange', text : 'Click' }] }
    ]
});
Result:

LIVE DEMO

To learn more about each column type, please read the API docs for them found under Grid/columns.

Column settings
Different column types support different settings, but there is a common base for all of them inherited from the class Column. This list contains some of most common settings that apply to all columns:

Settings	Explanation
renderer	A function that can affect styling and contents of a cell, more information below
afterRenderCell	A function called after a cell has been rendered, use it to style the row, cell or contents
editor	Type of editor to use when editing cell contents
align	Text align: left, center or right
hidden	Set to true to hide the column initially, can be shown using the column picker
locked	Set to true to lock/freeze the column
htmlEncode	Set to false to treat html in the cell content as html and not text
cls	CSS class to add to this columns header
cellCls	CSS class to add to each cell in this column
This snippet shows some of the settings:

const grid = new Grid({
    columns : [
        { field : 'firstName', text: 'First name' },
        { field : 'surName', text: 'Surname', hidden: true },
        { field : 'age', text: 'Age', align: 'right' },
        { field : 'city', text: 'City', editor: false }
    ]
});
Result:

LIVE DEMO

For a complete list of Column configuration settings, see Column in API docs.

Using renderers
Renderers are functions used to determine what is shown in a column. You can define a renderer in your column config:

const grid = new Grid({
    columns : [
        { text : 'Name', field : 'name', flex : 1, renderer: ({value}) => value }
    ]
});
The renderer defined above only returns the value which it is given (name). Usually you use the renderer to apply some formatting or CSS. Because of how the grid is rendered, renderers is the only place where it can be considered safe to programmatically add styling. A renderer is called with a single parameter having the following properties:

Parameter	Explanation
cellElement	Gives direct access to the cells DOM element, for adding styles or setting CSS classes
value	The value which would be displayed in the cell if no renderer was used
record	The data record for the current row.
size	An object used to control row height, set size.height to specify
grid	Grid instance
column	Column instance for the current cell
row	Row instance for the current cell. Use the Row's API to manipulate CSS classes
 You should never modify any records inside this method.
This snippet defines a couple of more complex renderers:

const grid = new Grid({
    columns : [
        {
            field : 'name',
            text  : 'Name',
            flex  : 1,
            renderer({ cellElement, record, row }) {
                // Add/remove classNames on the row
                row.assignCls({
                    private    : record.access === 'private',
                    deprecated : record.deprecated
                });
                cellElement.style.backgroundColor = record.color;
                cellElement.style.color = '#fff';
                return record.name;
            }
        },
        {
            field      : 'color',
            text       : 'Color',
            flex       : 1,
            htmlEncode : false,
            renderer({ value }) {
                return `
                    <div style="
                        width: 1em;
                        height: 1em;
                        border-radius: 3px;
                        background-color: ${value};
                        margin-right: .5em"></div>
                    ${value}
                `;
            }
        }
    ]
});
Result:

LIVE DEMO

If you want to customize the display of predefined columns (such as DateColumn, NumberColumn) but do not want to affect the output, you can use the afterRenderCell method to assign CSS classes to the cell / row.

const grid = new Grid({
    columns: [
        {
            text  : 'Date', // Can be any column to style rows
            type  : 'date',
            field : 'date',
            width : 100,
            afterRenderCell({ row, record, cellElement, value }) {
                // Add "past" CSS class to dates in the past
                cellElement.classList.toggle('past', value < Date.now());
            }
        }
    ]
});
For more formatting options, check the renderers demo.

Manipulating columns
Grid stores it columns as records in a store, allowing for easy reactive manipulation. The store (a ColumnStore) can be accessed using the grid.columns property:

// The ColumnStore
grid.columns;

// Get first column
const first = grid.columns.first;

// Get column by field
const age = grid.columns.get('age');

// If you are using multiple columns for the same field, it is safer to access them using id
const name = grid.columns.getById('idOfNameColumn');
The column records/instances can be used to manipulate the columns. For example:

// Change width
grid.columns.first.width = 100;

// Hide a column
ageColumn.hidden = true;
For available properties, see Column in API docs.

BryntumGrid events in React
Listening to events
The conventional React way is used to listen to Bryntum Grid events. For example, if we want to listen to cellEdit event we pass the listener function to onCellEdit property. The property name must be in camel case and is case sensitive.

const cellEditHandler = useCallback(({ selection }) => {
    console.log(selection); // actual logic comes here
});

// ...

return (
    <BryntumGrid
        onCellEdit={cellEditHandler}
        // other properties
    />
)
Preventable events
By returning false from a listener for an event documented as preventable the action that would otherwise be executed after the event is prevented. These events names are usually prefixed with before.

For example:

const App = props => {
    function onBeforeCellEditStart() {
        if (someCondition) {
            return false;
        }
    }

    return (
        <>
            <BryntumGrid
                onBeforeCellEditStart={onBeforeCellEditStart}
            />
        </>
    )
}
Using dataChange event to synchronize data
Bryntum Grid keeps all data in its stores which are automatically synchronized with the UI and the user actions. Nevertheless, it is sometimes necessary for the rest of the application to be informed about data changes. For that it is easiest to use dataChange event.

const App = props => {
    const syncData = ({ store, action, records }) => {
        console.log(`${store.id} changed. The action was: ${action}. Changed records: `, records);
        // Your sync data logic comes here
    }

    return (
        <BryntumGrid
            ref={gridRef}
            {...gridConfig}
            onDataChange={syncData}
        />
    )
}
You can find details of all events that are fired by BryntumGrid in the API documentation.


Using Bryntum Grid with React
Version requirements
Minimum supported:

React: 16.0.0 or higher
TypeScript: 3.6.0 or higher (for TypeScript application)
Sass: 1.78.0 or higher (for application, which uses *.scss styles)
Vite 4.0.0 or higher (for application build with Vite)
Recommended:

React: 18.0.0 or higher
TypeScript: 4.0.0 or higher (for TypeScript application)
Sass: 1.78.0 or higher (for application, which uses *.scss styles)
Vite 5.0.0 or higher (for application build with Vite)
Bryntum NPM repository access
Please refer to this guide for Bryntum NPM repository access.

Bryntum Grid
Bryntum Grid itself is framework agnostic, but ships with demos and wrappers to simplify using it with popular frameworks such as React. The purpose of this guide is to give a basic introduction on how to use Bryntum Grid with React.

Bryntum Grid is integrated to React applications using the provided wrappers.

The React wrappers
The wrappers encapsulate Bryntum Grid and other Bryntum widgets in React components that expose configuration options, properties, features and events. The wrapped Bryntum components are then used the usual React way.

View online demos
Bryntum Grid demos can be viewed in our online example browser.

Build and run local demos
Download distribution zip with demos according to this guide.

React demos are located in examples/frameworks/react folder inside distribution zip.

Each demo contains bundled README.md file in demo folder with build and run instructions.

You may run them either in development mode or built for production. They have been created using the latest version of React Vite.

In our Bryntum examples, we use start script for local development server:

npm install
npm start
The default package.json generated by Vite does not include start in scripts, so you may run existing dev script instead:

npm install
npm run dev
This starts a local server accessible at http://localhost:5173. If you modify the example code while running it locally, it is automatically rebuilt and updated in the browser allowing you to see the changes immediately.

The production version of an example, or your application, is built by running:

npm install
npm run build
The built version is then located in build sub-folder which contains the compiled code that can be deployed to your production server.

TypeScript and Typings
Bryntum bundles ship with typings for the classes for usage in TypeScript applications. You can find grid*.d.ts files in the build folder inside the distribution zip package. The definitions also contain a special config type which can be passed to the class constructor.

The config specific types are also accepted by multiple other properties and functions, for example the Store.data config of the Store which accepts type ModelConfig[].

Sample code for tree store creation with ModelConfig and StoreConfig classes:

import { Store, StoreConfig, ModelConfig } from '@bryntum/grid';

const storeConfig: StoreProps = {
    tree : true,
    data : [
        {
            id       : 1,
            children : [
                {
                    id : 2
                }
            ] as ModelConfig[]
        }
    ] as ModelConfig[]
};

new Store(storeConfig);
Wrappers
Installing the wrappers package
The wrappers are implemented in a separate package @bryntum/grid-react that is installed according to the used package manager. Please refer to this guide for Bryntum NPM repository access.

To use native API package classes with wrappers import them from @bryntum/grid.

import { Grid } from '@bryntum/grid';
Wrappers Overview
Wrappers are React components which provide full access to Bryntum API widget class configs, properties, events and features. Each Wrapper has it's own tag which can be used in React JSX code. This is the list of available wrappers for Bryntum Grid React package.

Wrapper tag name	API widget reference
<BryntumButton/>	Button
<BryntumButtonGroup/>	ButtonGroup
<BryntumCheckbox/>	Checkbox
<BryntumCheckboxGroup/>	CheckboxGroup
<BryntumChecklistFilterCombo/>	ChecklistFilterCombo
<BryntumChipView/>	ChipView
<BryntumCodeEditor/>	CodeEditor
<BryntumColorField/>	ColorField
<BryntumCombo/>	Combo
<BryntumContainer/>	Container
<BryntumDateField/>	DateField
<BryntumDatePicker/>	DatePicker
<BryntumDateRangeField/>	DateRangeField
<BryntumDateTimeField/>	DateTimeField
<BryntumDemoCodeEditor/>	DemoCodeEditor
<BryntumDisplayField/>	DisplayField
<BryntumDurationField/>	DurationField
<BryntumEditor/>	Editor
<BryntumFieldFilterPicker/>	FieldFilterPicker
<BryntumFieldFilterPickerGroup/>	FieldFilterPickerGroup
<BryntumFieldSet/>	FieldSet
<BryntumFileField/>	FileField
<BryntumFilePicker/>	FilePicker
<BryntumFilterField/>	FilterField
<BryntumGrid/>	Grid
<BryntumGridBase/>	GridBase
<BryntumGridFieldFilterPicker/>	GridFieldFilterPicker
<BryntumGridFieldFilterPickerGroup/>	GridFieldFilterPickerGroup
<BryntumGroupBar/>	GroupBar
<BryntumHint/>	Hint
<BryntumLabel/>	Label
<BryntumList/>	List
<BryntumMenu/>	Menu
<BryntumMonthPicker/>	MonthPicker
<BryntumNumberField/>	NumberField
<BryntumPagingToolbar/>	PagingToolbar
<BryntumPanel/>	Panel
<BryntumPasswordField/>	PasswordField
<BryntumRadio/>	Radio
<BryntumRadioGroup/>	RadioGroup
<BryntumSlider/>	Slider
<BryntumSlideToggle/>	SlideToggle
<BryntumSplitter/>	Splitter
<BryntumTabPanel/>	TabPanel
<BryntumTextAreaField/>	TextAreaField
<BryntumTextAreaPickerField/>	TextAreaPickerField
<BryntumTextField/>	TextField
<BryntumTimeField/>	TimeField
<BryntumTimePicker/>	TimePicker
<BryntumToolbar/>	Toolbar
<BryntumTreeCombo/>	TreeCombo
<BryntumTreeGrid/>	TreeGrid
<BryntumWidget/>	Widget
<BryntumYearPicker/>	YearPicker
Using the wrapper in your application
The wrapper defines a React component named BryntumGrid. You can use it the same way as you would use other React components. For example:

Sample code for App.js:

import React from 'react';
import { BryntumGrid } from '@bryntum/grid-react';
import { gridProps } from './AppConfig'

export const App = () => {
    return (
        <BryntumGrid
            {...gridProps}
            // other props, event handlers, etc
        />
    );
}
Sample code for AppConfig.js:

export const gridProps = {
    tooltip : "My cool Bryntum Grid component",
    // Bryntum Grid config options
};
Using the wrapper in TypeScript application
Bryntum React wrappers for Bryntum Grid are bundled with TypeScript definitions which makes it possible to use them in TypeScript React applications.

Each wrapper has properties definitions stored in a class with the wrapper's name and suffixed with Props.

This code shows how to use typed wrapper configuration for BryntumGrid:

AppConfig.ts:

import { BryntumGridProps } from '@bryntum/grid-react';

const gridProps: BryntumGridProps = {
    // Wrapper configuration
    ...
};
App.tsx:

import React, { FunctionComponent, useRef } from 'react';
import { BryntumGrid } from '@bryntum/grid-react';
import { Grid } from '@bryntum/grid';
import { gridProps } from './AppConfig';

const App: FunctionComponent = () => {
    const gridRef      = useRef<BryntumGrid>(null);
    const gridInstance = () => gridRef.current?.instance as Grid;

    return (
        <>
            <BryntumGrid
                ref = { gridRef }
                { ...gridProps }
            />
        </>
    );
};

export default App
Embedding widgets inside wrapper
Wrappers are designed to allow using Bryntum widgets as React components, but they themselves cannot contain other Bryntum wrappers inside their tag. To embed Bryntum widgets inside a wrapper you should instead use the available configuration options for the wrapper's widget. Please note that not all widgets may contain inner widgets, please refer to the API docs to check for valid configuration options.

This example shows how to use a Toolbar widget inside the wrapper for Bryntum Grid:

Sample code for AppConfig.js:

export const gridProps = {
    // Toolbar (tbar) config
    tbar : {
        items : [
            {
                type : 'button',
                text : 'My button'
            }
        ]
    }
    // Bryntum Grid config options
};
Syncing bound data changes
The stores used by the wrapper enable syncDataOnLoad by default (Stores not used by the wrapper have it disabled by default). This allows two-way binding to work out of the box. Without syncDataOnLoad, each change to state would apply the bound data as a completely new dataset. With syncDataOnLoad, the new state is instead compared to the old, and the differences are applied.

Rendering React components in column cells
Bryntum Grid column already supports a renderer configuration option which is a function that receives parameters used as inputs to compose the resulting html. Any kind of conditional complex logic can be used to prepare visually rich cell contents.

If you have a React component that implements the desired cell visualization, it is possible to use it by using regular JSX which references your React components from the cell renderer. The support is implemented in the BryntumGrid wrapper therefore the wrapper must be used for the JSX renderers to work.

Using simple inline JSX
Using inline JSX is as simple as the following:

renderer: ({ value }) => <CustomComponent>{value}</CustomComponent>
If you also need to access other data fields or pass them into the React component, you can do it this way:

renderer: (renderData) => {
    return (
        <CustomComponent dataProperty={renderData}><b>{renderData.value}</b>/{renderData.record.city}
        </CustomComponent>
    );
}
 Mind please that the above functions return html-like markup without quotes. That makes the return value JSX and it is understood and processed as such. If you enclose the markup in quotes it will not work
Using a custom React component
It is similarly simple. Let's have the following simple component:

import React from 'react';

const DemoButton = props => {
    return <button {...props}>{props.text}</button>;
};
The renderer then could be:

import DemoButton from '../components/DemoButton';

handleCellButtonClick = (record) => {
    alert('Go ' + record.team + '!');
};

return (
    <BryntumGrid
        // Columns
        columns={[
            {
                // Using custom React component
                renderer : ({ record }) =>
                    <DemoButton
                        text={'Go ' + record.team + '!'}
                        onClick={() => handleCellButtonClick(record)}
                    />,
                // other column props,
            },
            // ... other columns
        ]}
        // ... other BryntumGrid props
    />
);
The column renderer function above is expected to return JSX, exactly same as in the case of simple inline JSX, but here it returns imported DemoButton component. The renderer also passes the mandatory props down to the component so that it can render itself in the correct row context.

Using React as cell editor
It is also possible to use a React component as the cell editor that activates on the cell dbl-click by default. See Basic demo for the details of the implementation example of such cell editor

JSX Cell renderers and editors are implemented as React Portals that allow rendering of React components outside of their parent trees, anywhere in the DOM. We use this feature to render the above DemoButtons in scheduler cells. The following screenshot shows these buttons in the React Dev Tools. You can click on it so see it in action.

Example of Bryntum Scheduler with JSX

Custom cell editors with pickers
When a cell editor loses focus the editing is finalized by default which could cause problems when using components such as pickers, popups or custom date selectors. Clicking on the picker, outside of the cell editor, would cause closing the picker and ending the editing. The behavior can be changed by setting managedCellEditing to false.

{
    text               : 'Start',
    type               : 'date',
    field              : 'start',
    width              : '11em',
    editor             : (ref : any) => <DateEditor ref={ref} />,
    managedCellEditing : false
},
 Passing ref to the React editor is essential for the editor to work.
You can see the custom date editor implementation in this demo.

Using popups as cell editors
The editor is aligned and resized to the cell being edited by the CellEdit feature. This behavior is useful in majority of cases because no code has to be written in the React application. However, in some circumstances we might want to use richer editors, selectors or tables that do not fit into the cell but need to overlay the grid in a popup.

This is done by configuring the cellEditor to be floating. It is also recommended to provide a minHeight and/or a minWidth to the align config to ensure nice alignment and containment functionality.

import ColorEditor from './components/ColorEditor';

export const gridProps : BryntumGridProps = {
    columns: [
        {
            text       : 'Color',
            field      : 'color',
            editor     : (ref : any) => <ColorEditor ref={ref} />,
            cellEditor : {
                floating : true,
                align    : {
                   minHeight : 300    
                }
            }          
        }
    ]
    // other configuration options
}
And, you will probably also need to style the editor. For example, if we want a color selector in a popup we could have this render code:

render() {
    return (
        <div className="color-editor-container">
        // rest of the editor
        </div>
    )
}
and add the following CSS rules:

.color-editor-container {
    // Popup-like editor styling
    max-width     : 21em;
    padding       : 0.8em;
    background    : #fff;
    border        : 1px solid #ddd;
    border-radius : 4px;
}
No other code changes or special handling like showing, hiding and aligning the "popup" are needed.

 Passing ref to the React editor is essential for the editor to work. Also, the editor has to implement getValue, setValue, isValid and focus methods. See editor config option for more details.
You can see the React color editor in action in Cell edit demo (React + Vite) demo.

Using React components in tooltips and widgets
Important:

The support for React Components is implemented in the Grid wrapper therefore in applications that does not use the wrapper, but creates the Grid instances directly, JSX in tooltips and widgets does not work.

React Components support works only in tooltips and widgets that are children of Grid, not in standalone tooltips or widgets. In such cases, however, JSX can be used directly and does not need be "wrapped" in a Bryntum widget. Therefore, this is not a limitation, it is only to be considered in the application design.

React components in tooltips
Tooltips are usually configured as features that use JSX returned from the feature renderer or template. For example:

const gridProps = {
    cellTooltipFeature : {
        tooltipRenderer : ({ record }) => (
            <React.StrictMode>
                <DemoTooltip record={record}/>
            </React.StrictMode>
        )
    }
}

return <BryntumGrid {...gridProps} />
and:

import React from 'react';

const DemoTooltip = props => {
    const { record } = props;
    return (<div>React component:
        <b>{record.name}</b>
    </div>)
}

export default DemoTooltip
React component in Widget
A React component can be used as html in Widget, for example:

const gridProps = {
    bbar : {
        items : [{
            type : 'widget',
            html : <DemoWidget/>
        }]
    },
and:

import React from 'react';

const DemoWidget = props => {
    const title = 'Click me and watch the console output';
    const style = {
        cursor : 'pointer'
    };
    const handleClick = event => {
        console.log(event);
    }

    return <div title={title} style={style} onClick={handleClick}>React Demo Widget</div>
}

export default DemoWidget;
Rendering React components in Grid column headers
There are two possible ways to use React components in headers. Both methods are demonstrated in Using React Context with renderers demo.

Using headerWidgets
With this method we configure headerWidgets for the column as below:

const gridProps = {
    columns : [{
        field         : 'name',
        text          : 'Name',
        headerWidgets : [{
            type : 'widget',
            html : <Component />
        }]
    }
}
Using headerRenderer
We can return JSX from the headerRenderer:

const gridProps = {
    columns : [{
        type           : 'column',
        text           : 'Name',
        field          : 'name',
        headerRenderer : ({ column }) => <Component column={column} />
    }]
}
Configs, properties and events
All Bryntum React Wrappers support the full set of the public configs, properties and events of a component.

Features
Features are suffixed with Feature and act as both configs and properties for BryntumGridComponent. They are mapped to the corresponding API features of the instance.

This is a list of all BryntumGrid features:

Wrapper feature name	API feature reference
cellCopyPasteFeature	CellCopyPaste
cellEditFeature	CellEdit
cellMenuFeature	CellMenu
cellTooltipFeature	CellTooltip
columnAutoWidthFeature	ColumnAutoWidth
columnDragToolbarFeature	ColumnDragToolbar
columnPickerFeature	ColumnPicker
columnRenameFeature	ColumnRename
columnReorderFeature	ColumnReorder
columnResizeFeature	ColumnResize
excelExporterFeature	ExcelExporter
fileDropFeature	FileDrop
fillHandleFeature	FillHandle
filterFeature	Filter
filterBarFeature	FilterBar
groupFeature	Group
groupSummaryFeature	GroupSummary
headerMenuFeature	HeaderMenu
lockRowsFeature	LockRows
mergeCellsFeature	MergeCells
pdfExportFeature	PdfExport
printFeature	Print
quickFindFeature	QuickFind
regionResizeFeature	RegionResize
rowCopyPasteFeature	RowCopyPaste
rowEditFeature	RowEdit
rowExpanderFeature	RowExpander
rowReorderFeature	RowReorder
rowResizeFeature	RowResize
searchFeature	Search
sortFeature	Sort
splitFeature	Split
stickyCellsFeature	StickyCells
stripeFeature	Stripe
summaryFeature	Summary
treeFeature	Tree
treeGroupFeature	TreeGroup
Configuring features
Most features are enabled by default, in which case you can disable them like this:

const gridProps = {
    // other config
   cellEditFeature : false,
   groupFeature    : false,
};
Others require you to enable them:

const gridProps = {
    // other config
    sortFeature     : 'name', // enabled by default but configured to be sorted by name field.
    filterFeature   : true,
};
To learn more about configuration, visit the feature page from the API Feature reference table above.

The native Bryntum Grid instance
It is important to know that the React component that we may even call "grid" is not the native Bryntum Grid instance, it is a wrapper or an interface between the React application and the Bryntum Grid itself.

The properties and features are propagated from the wrapper down to the underlying Bryntum Grid instance but there might be the situations when you want to access the Bryntum Grid directly. That is fully valid approach and you are free to do it.

Accessing the Bryntum Grid instance
If you need to access Bryntum Grid instance, you can do like this:

const gridRef = useRef();

useEffect(() => {
    // the instance is available as
    console.log(gridRef.current.instance);
}, [])

return <BryntumGrid ref={gridRef} {...gridProps} />
Using Bryntum Grid themes
For the scheduler styling you must also import a CSS file that contains a theme for Bryntum Grid. There are two main ways of importing the theme.

Using single theme
The easiest way is to import the CSS file in your App.js or in App.scss.

In App.js you would import one of the following:

import '@bryntum/grid/grid.classic-dark.css';
import '@bryntum/grid/grid.classic-light.css';
import '@bryntum/grid/grid.classic.css';
import '@bryntum/grid/grid.material.css';
import '@bryntum/grid/grid.stockholm.css';
The syntax is slightly different in App.scss; use one of the following:

@import '@bryntum/grid/grid.classic-dark.css';
@import '@bryntum/grid/grid.classic-light.css';
@import '@bryntum/grid/grid.classic.css';
@import '@bryntum/grid/grid.material.css';
@import '@bryntum/grid/grid.stockholm.css';
 Importing theme in App.scss file is recommended because this way we keep all styling-related code together in one file
Selecting from multiple themes
Theme switching can be implemented with the help of the <BryntumThemeCombo /> component. It has to be imported as any other component before it is used, for example:

import { BryntumThemeCombo, ... } from '@bryntum/grid-react';
// ... other code

return (
    // ... other components
    <BryntumThemeCombo/>
    // ... other components
);
CSS and fonts files that contain themes must be accessible by the server in any subdirectory of the public server root in themes and themes/fonts. The easiest way of putting them there is to copy the files automatically during postinstall process in package.json:

{
  "scripts": {
    "postinstall": "postinstall"
  },
  "postinstall": {
    "node_modules/@bryntum/grid/*.css*": "copy public/themes/",
    "node_modules/@bryntum/grid/fonts": "copy public/themes/fonts"
  },
  "devDependencies": {
    "postinstall": "~0.7.0"
  }
}
 Use npm install --save-dev --save-prefix=~ postinstall to install the required postinstall package or add it manually to package.json
The last part is to add the default theme link to the head of public/index.html:

<head>
    <link
        rel="stylesheet"
        href="%PUBLIC_URL%/themes/grid.stockholm.css"
        data-bryntum-theme
    />
</head>
data-bryntum-theme is mandatory because BryntumThemeCombo relies on it If you adjust location of themes and fonts, adjust it in both package.json and in index.html, for example my-resources/themes/ and my-resources/themes/fonts. No other configuration is needed
Loading components dynamically with Next.js
Bryntum components are client-side only, they do not support server-side rendering. Therefore they must be loaded with ssr turned off. Furthermore, the life cycle of dynamically loaded components is different from normal React components hence the following steps are needed.

The BryntumGrid must be wrapped in another component so that React refs will continue to work. To implement it create a folder outside of Next.js pages, for example components, and put this extra wrapper there.

Sample code for components/Grid.js:

/**
 * A simple wrap around BryntumGrid for ref to work
 */
import { BryntumGrid } from '@bryntum/grid-react';

export default function Grid({ gridRef, ...props }) {
    return <BryntumGrid {...props} ref={gridRef}/>
}
The above component can then be loaded dynamically with this code:

import dynamic from "next/dynamic";
import { useRef } from 'react';

const Grid = dynamic(
    () => import("../components/Grid.js"), { ssr : false }
);

const MyComponent = () => {
    const gridRef = useRef();

    const clickHandler = function(e) {
        // This will log the Bryntum Grid native instance after it has been loaded
        console.log(gridRef.current?.instance);
    }

    return (
        <>
            <button onClick={clickHandler}>ref test</button>
            <Grid
                gridRef={gridRef}
                // other props
            />
        </>
    )
}
Best practices
There are many possible ways of creating and building React applications. We are using Vite to create our React examples as it has proven to offer higher efficiency and better performance in development.

We recommend to set up a React application with Vite from scratch but if you take our demo as the basis, please do not forget to clean it up from imports, resources, css files and rules that are not needed.

Our examples also use resources from @bryntum/demo-resources, for example scss/example.scss, fonts and images that are used to style demo's header, logo, etc. These are generally not needed in your application because you have different logo, colors, layout of header, etc.

Also we do not recommend to copy the downloaded and unzipped Bryntum Grid to your project tree not only because it would bloat the size but mainly because it can fool the IDE to propose auto-imports from the wrong places.

If you decide to copy the files from Bryntum download to your project, always copy selectively only the source files you need, not the whole distribution.

Please refer to this Quick start guide for creating your application.

Best practices for configuration management
Configuration options can be passed to the wrapper component by passing them as React props. Two approaches for managing your configuration are listed below. You can use both of these approaches at the same time as well, just make sure you're not setting the same configuration in multiple places.

External Configuration for static settings:
For configurations that remain constant, such as column setups or widget options, it's best to define these outside of your React component. This approach minimizes re-rendering overhead, and keeps components tidy. For example:

Sample code for App.js:

import React from 'react';
import { BryntumGrid } from '@bryntum/grid-react';
import { gridConfig } from './AppConfig'

export const App = () => {
    return (
        <BryntumGrid
            {...gridConfig}
            // other props, event handlers, etc
        />
    );
}
Sample code for AppConfig.js:

export const gridProps = {
    tooltip : "My cool Bryntum Grid component",
    // Bryntum Grid config options
};
State-managed configuration for dynamic settings:
When your configuration needs to adapt based on the component's state or props, encapsulate your configuration within the component using React's useState hook. This ensures that your configuration maintains its reference across re-renders, preventing unnecessary calculations. For example:

Sample code for App.js:

import React, { useState } from 'react';
import { BryntumGrid } from '@bryntum/grid-react';

export const App = () => {

    const [start, setStart] = useState(new Date());

    const [gridConfig] = useState({
        startDate: start
        // Bryntum Grid config options
    })

    return (
        <BryntumGrid
            {...gridConfig}
            // other props, event handlers, etc
        />
    );
}
React 18+ development mode behavior
React 18 and above provides a mount-unmount-mount cycle in the development mode as part of the Strict mode, which aims to help developers catch and fix bugs related to side effects, memory leaks, and other component lifecycle issues.

React mounts a component, triggering the component's lifecycle hook (useEffect) when it is first rendered.
React immediately unmounts the component. This triggers the component's cleanup function returned by the useEffect hook.
React mounts the component again. This second mount simulates a remount scenario, which can happen in real-world applications (e.g., due to routing changes, state updates, etc.).
Please note that this behavior might lead to data loading issues, if so it might help to wait for the data to load before rendering the component. Learn more about StrictMode.

Troubleshooting
Please refer to this Troubleshooting guide.

References
Config options, features, events and methods Bryntum Grid API docs
Visit React Framework Homepage
Post your questions to Bryntum Support Forum
Contact us
Last modified on 2025-05-27 9:28:25
