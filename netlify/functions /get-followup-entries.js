/**
     * Loads all data from the database via the 'get-followup-entries' Netlify Function.
     */
    async function loadDataFromDatabase() {
        try {
            // *** CALL THE ACTUAL NETLIFY FUNCTION ***
            const response = await fetch('/.netlify/functions/get-followup-entries');
            
            if (!response.ok) {
                // Read the error message from the server response body
                const errorResult = await response.json();
                throw new Error(errorResult.error || `Server Fetch Error: ${response.status}`);
            }

            // Return the array of entries from the server
            const data = await response.json();
            showNotification(`Successfully loaded ${data.length} entries from the database.`, 'info', 3000);
            return data;

        } catch (error) {
            console.error("Error loading data from database:", error);
            // Fallback: If the server call fails, show an error and return empty.
            showNotification(`CRITICAL: Failed to load data from server: ${error.message}. Displaying empty data.`, 'error', 7000);
            return []; 
        }
    }
