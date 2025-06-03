import { BryntumGrid } from '@bryntum/grid-react';
import { useEffect, useRef, useState } from 'react';
import { supabase } from './supabaseClient';
import { gridConfig } from './GridConfig';
import './App.scss';

function App() {
    const [data, setData] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const gridRef = useRef();

    // Get grid instance
    const getGrid = () => gridRef.current?.instance;

    // Load initial data
    useEffect(() => {
        let mounted = true;

        const init = async () => {
            try {
                // Wait for grid to be ready
                await new Promise(resolve => {
                    const checkGrid = () => {
                        if (getGrid()) {
                            resolve();
                        } else {
                            setTimeout(checkGrid, 10);
                        }
                    };
                    checkGrid();
                });

                if (!mounted) return;

                // Fetch data
                const { data: records, error } = await supabase
                    .from('people')
                    .select('*');
                
                if (!mounted) return;
                
                if (error) throw error;
                
                setData(records || []);
                setIsInitialLoad(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                if (mounted) {
                    setData([]);
                    setIsInitialLoad(false);
                }
            }
        };

        init();

        return () => {
            mounted = false;
        };
    }, []);

    // Set up real-time subscription
    useEffect(() => {
        const grid = getGrid();
        if (!grid) return;

        // Subscribe to changes on the people table
        const subscription = supabase
            .channel('people_changes')
            .on('postgres_changes', 
                {
                    event: '*',  // Listen to all events (INSERT, UPDATE, DELETE)
                    schema: 'public',
                    table: 'people'
                },
                async (payload) => {
                    const { eventType, new: newRecord, old: oldRecord } = payload;
                    const store = grid.store;

                    try {
                        switch (eventType) {
                            case 'INSERT': {
                                // Only add if we don't already have this record
                                if (!store.getById(newRecord.id)) {
                                    store.add(newRecord);
                                }
                                break;
                            }
                            case 'UPDATE': {
                                const record = store.getById(oldRecord.id);
                                if (record) {
                                    // Update the record in place
                                    record.set(newRecord);
                                }
                                break;
                            }
                            case 'DELETE': {
                                const record = store.getById(oldRecord.id);
                                if (record) {
                                    store.remove(record);
                                }
                                break;
                            }
                        }
                    } catch (error) {
                        console.error('Error handling real-time update:', error);
                        // Refresh the entire grid data if something goes wrong
                        await fetchData();
                    }
                }
            )
            .subscribe();

        // Cleanup subscription when component unmounts
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Fetch data from Supabase
    const fetchData = async () => {
        try {
            const grid = getGrid();
            if (!grid) {
                console.warn('Grid not initialized');
                return;
            }

            const { data: records, error } = await supabase
                .from('people')
                .select('*');
            
            if (error) throw error;
            
            setData(records || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            setData([]);
        }
    };

    // Clean and validate field value
    const cleanValue = (value, type = 'string') => {
        if (value === undefined || value === null) {
            return type === 'string' ? '' : null;
        }
        return type === 'string' ? String(value).trim() : value;
    };

    // Validate record before sending to server
    const validateRecord = (record) => {
        // Ensure record exists
        if (!record || typeof record !== 'object') {
            return false;
        }

        // Clean and validate name (required)
        const name = cleanValue(record.name);
        if (!name) {
            return false;
        }

        // Validate age if present
        const age = record.age !== undefined ? Number(record.age) : null;
        if (age !== null && (isNaN(age) || age < 0 || age > 150)) {
            return false;
        }

        return true;
    };

    // Prepare record for database
    const prepareRecord = (record) => ({
        name: cleanValue(record.name),
        age: record.age !== undefined ? Number(record.age) : null,
        city: cleanValue(record.city),
        food: cleanValue(record.food),
        color: cleanValue(record.color)
    });

    // Handle record changes
    const onDataChange = async ({ store, action, records, changes }) => {
        // Skip if this is the initial data load
        if (isInitialLoad) return;
        
        const grid = getGrid();
        if (!grid) {
            console.warn('Grid not initialized');
            return;
        }
        
        try {
            switch (action) {
                case 'add': {
                    // Don't do anything when a record is first added
                    // We'll handle the save when it's actually updated
                    break;
                }

                case 'update': {
                    for (const record of records) {
                        // Skip if no actual changes were made
                        if (!changes || Object.keys(changes).length === 0) continue;

                        // For records with temporary IDs (new records)
                        if (typeof record.id !== 'number') {
                            if (!validateRecord(record)) continue;

                            const { data: insertedData, error: insertError } = await supabase
                                .from('people')
                                .insert([prepareRecord(record)])
                                .select();
                            
                            if (insertError) throw insertError;

                            if (insertedData && insertedData.length > 0) {
                                // Update the record in place with the new ID and any other server-side changes
                                record.set(insertedData[0]);
                            }
                        }
                        // For existing records
                        else {
                            if (!validateRecord(record)) continue;

                            const { error: updateError } = await supabase
                                .from('people')
                                .update(prepareRecord(record))
                                .eq('id', record.id);
                            
                            if (updateError) throw updateError;
                        }
                    }
                    break;
                }

                case 'remove': {
                    // Only delete records that have a numeric ID (existing records)
                    for (const record of records) {
                        // Skip records with temporary IDs
                        if (typeof record.id !== 'number') continue;

                        const { error: deleteError } = await supabase
                            .from('people')
                            .delete()
                            .eq('id', record.id);
                        
                        if (deleteError) throw deleteError;
                    }
                    break;
                }
            }
        } catch (error) {
            console.error('Error updating data:', error);
            // Refresh grid data in case of error
            await fetchData();
        }
    };

    return (
        <BryntumGrid
            ref={gridRef}
            {...gridConfig}
            data={data}
            onDataChange={onDataChange}
        />
    );
}

export default App;
