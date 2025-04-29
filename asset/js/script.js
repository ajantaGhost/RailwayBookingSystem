// Base URL for the Indian Railways API
// Note: This is a placeholder. You'll need to use the actual API endpoint and API key
const API_BASE_URL = 'https://api.indianrail.gov.in/v1/';
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key

// DOM Elements
const searchForm = document.getElementById('search-form');
const fromStationInput = document.getElementById('from-station');
const toStationInput = document.getElementById('to-station');
const fromStationCodeInput = document.getElementById('from-station-code');
const toStationCodeInput = document.getElementById('to-station-code');
const fromSuggestions = document.getElementById('from-suggestions');
const toSuggestions = document.getElementById('to-suggestions');
const journeyDateInput = document.getElementById('journey-date');
const quotaSelect = document.getElementById('quota');
const swapButton = document.getElementById('swap-btn');
const resultsContent = document.getElementById('results-content');

// Set minimum date to today
const today = new Date();
const formattedToday = today.toISOString().split('T')[0];
journeyDateInput.min = formattedToday;
journeyDateInput.value = formattedToday;

// Sample station data for demo (in a real application, this would come from the API)
const sampleStations = [
    { code: 'NDLS', name: 'New Delhi', state: 'Delhi' },
    { code: 'MAS', name: 'Chennai Central', state: 'Tamil Nadu' },
    { code: 'CSTM', name: 'Mumbai CST', state: 'Maharashtra' },
    { code: 'HWH', name: 'Howrah Junction', state: 'West Bengal' },
    { code: 'SBC', name: 'Bangalore City Junction', state: 'Karnataka' },
    { code: 'SC', name: 'Secunderabad Junction', state: 'Telangana' },
    { code: 'MGS', name: 'Mughal Sarai Junction', state: 'Uttar Pradesh' },
    { code: 'LTT', name: 'Lokmanya Tilak Terminus', state: 'Maharashtra' },
    { code: 'ADI', name: 'Ahmedabad Junction', state: 'Gujarat' },
    { code: 'PNBE', name: 'Patna Junction', state: 'Bihar' },
    { code: 'CNB', name: 'Kanpur Central', state: 'Uttar Pradesh' },
    { code: 'LKO', name: 'Lucknow Charbagh', state: 'Uttar Pradesh' },
    { code: 'JAT', name: 'Jammu Tawi', state: 'Jammu & Kashmir' },
    { code: 'PUNE', name: 'Pune Junction', state: 'Maharashtra' },
    { code: 'ASR', name: 'Amritsar Junction', state: 'Punjab' },
    { code: 'JP', name: 'Jaipur Junction', state: 'Rajasthan' },
    { code: 'BPL', name: 'Bhopal Junction', state: 'Madhya Pradesh' },
    { code: 'GHY', name: 'Guwahati', state: 'Assam' },
    { code: 'NJP', name: 'New Jalpaiguri', state: 'West Bengal' },
    { code: 'MYS', name: 'Mysore Junction', state: 'Karnataka' }
];

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Station input events
    fromStationInput.addEventListener('input', () => showSuggestions(fromStationInput, fromSuggestions, fromStationCodeInput));
    toStationInput.addEventListener('input', () => showSuggestions(toStationInput, toSuggestions, toStationCodeInput));
    
    // Form submission
    searchForm.addEventListener('submit', handleSearch);
    
    // Swap button
    swapButton.addEventListener('click', swapStations);
    
    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.station-select')) {
            fromSuggestions.classList.remove('active');
            toSuggestions.classList.remove('active');
        }
    });
});

// Function to show station suggestions
function showSuggestions(input, suggestionsContainer, codeInput) {
    const searchTerm = input.value.toLowerCase();
    
    if (searchTerm.length < 2) {
        suggestionsContainer.classList.remove('active');
        codeInput.value = '';
        return;
    }
    
    // Filter stations based on search term
    const filteredStations = sampleStations.filter(station => 
        station.code.toLowerCase().includes(searchTerm) || 
        station.name.toLowerCase().includes(searchTerm)
    ).slice(0, 10); // Limit to 10 results
    
    if (filteredStations.length === 0) {
        suggestionsContainer.classList.remove('active');
        return;
    }
    
    // Clear previous suggestions
    suggestionsContainer.innerHTML = '';
    
    // Add new suggestions
    filteredStations.forEach(station => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'station-suggestion';
        suggestionItem.innerHTML = `
            <div class="suggestion-code">${station.code}</div>
            <div class="suggestion-name">${station.name}, ${station.state}</div>
        `;
        
        // Add click event to select the station
        suggestionItem.addEventListener('click', () => {
            input.value = `${station.name} (${station.code})`;
            codeInput.value = station.code;
            suggestionsContainer.classList.remove('active');
        });
        
        suggestionsContainer.appendChild(suggestionItem);
    });
    
    suggestionsContainer.classList.add('active');
}

// Function to swap origin and destination stations
function swapStations() {
    const tempValue = fromStationInput.value;
    const tempCode = fromStationCodeInput.value;
    
    fromStationInput.value = toStationInput.value;
    fromStationCodeInput.value = toStationCodeInput.value;
    
    toStationInput.value = tempValue;
    toStationCodeInput.value = tempCode;
}

// Function to handle search form submission
function handleSearch(e) {
    e.preventDefault();
    
    // Validate inputs
    if (!fromStationCodeInput.value || !toStationCodeInput.value) {
        alert('Please select valid origin and destination stations');
        return;
    }
    
    if (fromStationCodeInput.value === toStationCodeInput.value) {
        alert('Origin and destination stations cannot be the same');
        return;
    }
    
    // Show loading state
    showLoading();
    
    // Get form values
    const fromStation = fromStationCodeInput.value;
    const toStation = toStationCodeInput.value;
    const journeyDate = journeyDateInput.value;
    const quota = quotaSelect.value;
    
    // In a real application, you would make an API call here
    // For demo purposes, we'll use setTimeout to simulate an API call
    setTimeout(() => {
        try {
            // Simulate API call with dummy data
            const trainsBetweenStations = fetchTrainsBetweenStations(fromStation, toStation, journeyDate, quota);
            displayResults(trainsBetweenStations, fromStation, toStation, journeyDate);
        } catch (error) {
            showError(error.message);
        }
    }, 1500);
}

// Function to show loading state
function showLoading() {
    resultsContent.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
        </div>
    `;
}

// Function to show error message
function showError(message) {
    resultsContent.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
        <div class="no-results">
            <span class="fa fa-sad-tear"></span>
            <h3>Oops! Something went wrong</h3>
            <p>Please try again later or contact support if the problem persists.</p>
        </div>
    `;
}

// Function to fetch trains between stations (simulated API call)
function fetchTrainsBetweenStations(fromStation, toStation, date, quota) {
    // In a real application, this would be an API call
    // For demo purposes, we'll return some dummy data
    
    // This is where you would use the Indian Railways API
    // const url = `${API_BASE_URL}/trainsBetweenStations?fromStation=${fromStation}&toStation=${toStation}&date=${date}&quota=${quota}`;
    // const options = {
    //     method: 'GET',
    //     headers: {
    //         'X-RapidAPI-Key': API_KEY,
    //         'X-RapidAPI-Host': 'irctc1.p.rapidapi.com'
    //     }
    // };
    // const response = await fetch(url, options);
    // const data = await response.json();
    // return data;
    
    // Sample data for demonstration
    return {
        "success": true,
        "timestamp": new Date().toISOString(),
        "fromStation": getStationByCode(fromStation),
        "toStation": getStationByCode(toStation),
        "journeyDate": date,
        "quota": quota,
        "trains": [
            {
                "trainNumber": "12951",
                "trainName": "Mumbai Rajdhani",
                "fromStation": fromStation,
                "toStation": toStation,
                "departureTime": "17:40",
                "arrivalTime": "08:35",
                "arrivalDay": 2,
                "travelTime": "14h 55m",
                "distance": "1386 km",
                "runningDays": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                "classes": [
                    { "code": "3A", "name": "AC 3 Tier", "availability": "WL 12", "fare": 2150 },
                    { "code": "2A", "name": "AC 2 Tier", "availability": "Available", "fare": 3100 },
                    { "code": "1A", "name": "AC First Class", "availability": "Not Available", "fare": 5280 }
                ]
            },
            {
                "trainNumber": "12259",
                "trainName": "Duronto Express",
                "fromStation": fromStation,
                "toStation": toStation,
                "departureTime": "20:10",
                "arrivalTime": "12:45",
                "arrivalDay": 2,
                "travelTime": "16h 35m",
                "distance": "1478 km",
                "runningDays": ["Mon", "Wed", "Fri"],
                "classes": [
                    { "code": "SL", "name": "Sleeper", "availability": "Available", "fare": 800 },
                    { "code": "3A", "name": "AC 3 Tier", "availability": "Available", "fare": 2025 },
                    { "code": "2A", "name": "AC 2 Tier", "availability": "RAC 5", "fare": 2850 }
                ]
            },
            {
                "trainNumber": "12909",
                "trainName": "Garib Rath Express",
                "fromStation": fromStation,
                "toStation": toStation,
                "departureTime": "15:25",
                "arrivalTime": "08:10",
                "arrivalDay": 2,
                "travelTime": "16h 45m",
                "distance": "1421 km",
                "runningDays": ["Tue", "Thu", "Sat"],
                "classes": [
                    { "code": "3A", "name": "AC 3 Tier", "availability": "Available", "fare": 1610 }
                ]
            }
        ]
    };
}

// Function to get station details by station code
function getStationByCode(code) {
    const station = sampleStations.find(s => s.code === code);
    return station ? station : { code: code, name: code, state: '' };
}

// Function to display search results
function displayResults(data, fromStation, toStation, journeyDate) {
    if (!data.success || !data.trains || data.trains.length === 0) {
        resultsContent.innerHTML = `
            <div class="no-results">
                <span class="fa fa-search"></span>
                <h3>No trains found</h3>
                <p>No trains found between ${getStationByCode(fromStation).name} and ${getStationByCode(toStation).name} on ${formatDate(journeyDate)}.</p>
                <p>Please try a different date or route.</p>
            </div>
        `;
        return;
    }
    
    // Format the date for display
    const displayDate = formatDate(journeyDate);
    
    // Create the header for results
    let resultsHTML = `
        <div class="results-header">
            <div class="route-info">
                <h2>${getStationByCode(fromStation).name} <span class="fa fa-arrow-right"></span> ${getStationByCode(toStation).name}</h2>
                <p>Journey Date: ${displayDate} | Quota: ${getQuotaName(data.quota)}</p>
            </div>
            <div class="found-info">
                <p>${data.trains.length} Trains Found</p>
            </div>
        </div>
    `;
    
    // Create the table for train results
    resultsHTML += `
        <div class="trains-container">
    `;
    
    // Add each train to the results
    data.trains.forEach(train => {
        resultsHTML += `
            <div class="train-card">
                <div class="train-header">
                    <div class="train-name-number">
                        <h3>${train.trainName}</h3>
                        <p class="train-number">#${train.trainNumber}</p>
                    </div>
                    <div class="running-days">
                        ${formatRunningDays(train.runningDays)}
                    </div>
                </div>
                
                <div class="journey-details">
                    <div class="departure">
                        <p class="time">${train.departureTime}</p>
                        <p class="station">${getStationByCode(train.fromStation).name}</p>
                        <p class="date">${displayDate}</p>
                    </div>
                    
                    <div class="journey-meta">
                        <div class="journey-line">
                            <span class="dot start"></span>
                            <span class="line"></span>
                            <span class="dot end"></span>
                        </div>
                        <div class="journey-info">
                            <p class="duration">${train.travelTime}</p>
                            <p class="distance">${train.distance}</p>
                            <p class="day-info">Arrives Day ${train.arrivalDay}</p>
                        </div>
                    </div>
                    
                    <div class="arrival">
                        <p class="time">${train.arrivalTime}</p>
                        <p class="station">${getStationByCode(train.toStation).name}</p>
                        <p class="date">${getArrivalDate(journeyDate, train.arrivalDay)}</p>
                    </div>
                </div>
                
                <div class="classes">
                    <h4>Available Classes:</h4>
                    <div class="class-list">
                        ${formatClasses(train.classes)}
                    </div>
                </div>
                
                <div class="train-actions">
                    <button class="btn book-btn" onclick="redirectToBooking('${train.trainNumber}', '${train.trainName}', '${train.fromStation}', '${train.toStation}', '${journeyDate}', '${train.departureTime}', '${train.arrivalTime}', '${train.arrivalDay}')">Book Now</button>
                    <button class="btn details-btn">View Details</button>
                </div>
            </div>
        `;
    });
    
    resultsHTML += `
        </div>
    `;
    
    // Update the results content
    resultsContent.innerHTML = resultsHTML;
}

// Function to format date for display
function formatDate(dateString) {
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', options);
}

// Function to get arrival date based on journey date and arrival day
function getArrivalDate(journeyDate, arrivalDay) {
    const date = new Date(journeyDate);
    date.setDate(date.getDate() + (arrivalDay - 1)); // Subtract 1 because arrivalDay 1 means same day
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

// Function to format running days
function formatRunningDays(days) {
    const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    let html = '<div class="days-container">';
    
    allDays.forEach(day => {
        const isRunning = days.includes(day);
        html += `<span class="day ${isRunning ? 'active' : ''}">${day.charAt(0)}</span>`;
    });
    
    html += '</div>';
    return html;
}

// Function to format classes
function formatClasses(classes) {
    let html = '';
    
    classes.forEach(cls => {
        // Determine availability status class
        let statusClass = '';
        if (cls.availability.toLowerCase().includes('available')) {
            statusClass = 'available';
        } else if (cls.availability.toLowerCase().includes('wl') || cls.availability.toLowerCase().includes('rac')) {
            statusClass = 'waiting';
        } else {
            statusClass = 'not-available';
        }
        
        html += `
            <div class="class-item">
                <div class="class-details">
                    <span class="class-code">${cls.code}</span>
                    <span class="class-name">${cls.name}</span>
                </div>
                <div class="class-status">
                    <span class="availability ${statusClass}">${cls.availability}</span>
                    <span class="fare">₹${cls.fare}</span>
                </div>
            </div>
        `;
    });
    
    return html;
}

// Function to get quota name from code
function getQuotaName(quotaCode) {
    const quotas = {
        'GN': 'General',
        'TQ': 'Tatkal',
        'PT': 'Premium Tatkal',
        'LD': 'Ladies',
        'DF': 'Defence',
        'FT': 'Foreign Tourist',
        'SS': 'Senior Citizen',
        'HP': 'Physically Handicapped',
        'YU': 'Youth'
    };
    
    return quotas[quotaCode] || quotaCode;
}

// Function to redirect to booking page
function redirectToBooking(trainNumber, trainName, fromStation, toStation, journeyDate, departureTime, arrivalTime, arrivalDay) {
    // Create query parameters for the booking page
    const params = new URLSearchParams({
        trainNumber: trainNumber,
        trainName: trainName,
        fromStation: fromStation,
        toStation: toStation,
        journeyDate: journeyDate,
        departureTime: departureTime,
        arrivalTime: arrivalTime,
        arrivalDay: arrivalDay,
        quota: quotaSelect.value
    });
    
    // Redirect to the booking page with parameters
    window.location.href = `/asset/html/trainBooking.html?${params.toString()}`;
}