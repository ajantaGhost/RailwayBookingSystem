// Import jsPDF if using a module system
// import { jsPDF } from "jspdf";

// DOM Elements
const pnrNumberElement = document.getElementById('pnr-number');
const pnrDisplayElement = document.getElementById('pnr-display');
const bookingDateElement = document.getElementById('booking-date');
const trainNameElement = document.getElementById('train-name');
const trainNumberElement = document.getElementById('train-number');
const trainClassElement = document.getElementById('train-class');
const trainQuotaElement = document.getElementById('train-quota');
const fromStationElement = document.getElementById('from-station');
const toStationElement = document.getElementById('to-station');
const departureTimeElement = document.getElementById('departure-time');
const arrivalTimeElement = document.getElementById('arrival-time');
const departureDateElement = document.getElementById('departure-date');
const arrivalDateElement = document.getElementById('arrival-date');
const passengerListElement = document.getElementById('passenger-list');
const baseFareElement = document.getElementById('base-fare');
const reservationChargesElement = document.getElementById('reservation-charges');
const gstElement = document.getElementById('gst');
const totalAmountElement = document.getElementById('total-amount');

// Buttons
const downloadBtn = document.getElementById('download-btn');
const printBtn = document.getElementById('print-btn');
const emailBtn = document.getElementById('email-btn');

// Sample station data (same as in booking page)
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
    { code: 'JAT', name: 'Jammu Tawi', state: 'Jammu & Kashmir' }
];

// Sample train data
const sampleTrains = [
    { number: '12301', name: 'Howrah Rajdhani', type: 'Rajdhani' },
    { number: '12951', name: 'Mumbai Rajdhani', type: 'Rajdhani' },
    { number: '12259', name: 'Sealdah Duronto', type: 'Duronto' },
    { number: '12650', name: 'Karnataka Sampark Kranti', type: 'Sampark Kranti' },
    { number: '12622', name: 'Tamil Nadu Express', type: 'Superfast' },
    { number: '12909', name: 'Garib Rath Express', type: 'Garib Rath' },
    { number: '12308', name: 'Jodhpur Howrah Express', type: 'Express' },
    { number: '12382', name: 'Poorva Express', type: 'Express' }
];

// Helper functions
function getStationNameByCode(code) {
    const station = sampleStations.find(station => station.code === code);
    return station ? station.name : code;
}

function getTrainNameByNumber(number) {
    const train = sampleTrains.find(train => train.number === number);
    return train ? train.name : 'Unknown Train';
}

function generateRandomPNR() {
    return '2' + Math.floor(Math.random() * 9000000000 + 1000000000);
}

function formatDate(date) {
    const options = { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
}

function formatTime(date) {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function calculateTotalFare(baseFare, reservationCharges, gst) {
    return parseFloat(baseFare) + parseFloat(reservationCharges) + parseFloat(gst);
}

// Function to populate ticket details from session storage
function populateTicketDetails() {
    // Get the booking data from session storage
    const storedData = sessionStorage.getItem('bookingData');
    
    if (!storedData) {
        console.error('No booking data found in session storage');
        return;
    }
    
    // Parse the booking data
    const bookingData = JSON.parse(storedData);
    console.log('Retrieved booking data:', bookingData);
    
    // Update PNR and booking information
    pnrNumberElement.textContent = bookingData.pnr;
    pnrDisplayElement.textContent = bookingData.pnr;
    bookingDateElement.textContent = bookingData.bookingDate;
    
    // Update train information
    trainNameElement.textContent = bookingData.trainName;
    trainNumberElement.textContent = bookingData.trainNumber;
    trainClassElement.textContent = bookingData.trainClass;
    trainQuotaElement.textContent = bookingData.trainQuota;
    
    // Get station information
    const fromCode = bookingData.fromStation;
    const toCode = bookingData.toStation;
    const fromStation = getStationNameByCode(fromCode);
    const toStation = getStationNameByCode(toCode);
    
    // Update station information
    fromStationElement.textContent = `${fromStation} (${fromCode})`;
    toStationElement.textContent = `${toStation} (${toCode})`;
    
    // Update times and dates
    departureTimeElement.textContent = formatTimeFromString(bookingData.departureTime);
    arrivalTimeElement.textContent = formatTimeFromString(bookingData.arrivalTime);
    departureDateElement.textContent = bookingData.departureDate;
    arrivalDateElement.textContent = bookingData.arrivalDate;
    
    // Update fare information
    baseFareElement.textContent = `₹${bookingData.baseFare}`;
    reservationChargesElement.textContent = `₹${bookingData.reservationCharges}`;
    gstElement.textContent = `₹${bookingData.gst}`;
    totalAmountElement.textContent = `₹${bookingData.totalAmount}`;
    
    // Update passenger list
    passengerListElement.innerHTML = '';
    bookingData.passengers.forEach((passenger, index) => {
        const passengerRow = document.createElement('tr');
        passengerRow.innerHTML = `
            <td>${index + 1}</td>
            <td>${passenger.name}</td>
            <td>${passenger.age}</td>
            <td>${passenger.gender}</td>
            <td>${passenger.seatNumber}</td>
            <td><span class="status ${passenger.status.toLowerCase()}">${passenger.status}</span></td>
        `;
        passengerListElement.appendChild(passengerRow);
    });
    
    // Save ticket data for download/print/email functions
    window.ticketData = {
        pnr: bookingData.pnr,
        bookingDate: bookingData.bookingDate,
        trainNumber: bookingData.trainNumber,
        trainName: bookingData.trainName,
        trainClass: bookingData.trainClass,
        trainQuota: bookingData.trainQuota,
        fromStation: `${fromStation} (${fromCode})`,
        toStation: `${toStation} (${toCode})`,
        departureTime: formatTimeFromString(bookingData.departureTime),
        arrivalTime: formatTimeFromString(bookingData.arrivalTime),
        departureDate: bookingData.departureDate,
        arrivalDate: bookingData.arrivalDate,
        passengers: bookingData.passengers,
        baseFare: bookingData.baseFare,
        reservationCharges: bookingData.reservationCharges,
        gst: bookingData.gst,
        totalAmount: bookingData.totalAmount
    };
}

// Format time from string (converts "HH:MM" to "HH:MM AM/PM")
function formatTimeFromString(timeString) {
    if (!timeString) return 'Unknown';
    
    // Replace URL-encoded colon if present
    timeString = timeString.replace('%3A', ':');
    
    let [hours, minutes] = timeString.split(':');
    hours = parseInt(hours);
    
    const amPm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${hours}:${minutes} ${amPm}`;
}

// Download ticket as PDF
function downloadTicket() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text("Indian Railways E-Ticket", 105, 20, { align: "center" });
    
    // Add logo placeholder
    doc.rect(20, 30, 30, 10);
    doc.setFontSize(8);
    doc.text("IR LOGO", 35, 36, { align: "center" });
    
    // Add PNR and booking date
    doc.setFontSize(11);
    doc.text(`PNR Number: ${window.ticketData.pnr}`, 60, 35);
    doc.text(`Booking Date: ${window.ticketData.bookingDate}`, 60, 40);
    
    // Add train information
    doc.setFontSize(14);
    doc.text(`${window.ticketData.trainName} (${window.ticketData.trainNumber})`, 20, 55);
    doc.setFontSize(11);
    doc.text(`Class: ${window.ticketData.trainClass} | Quota: ${window.ticketData.trainQuota}`, 20, 62);
    
    // Add journey information
    doc.text(`From: ${window.ticketData.fromStation}`, 20, 72);
    doc.text(`Departure: ${window.ticketData.departureDate} at ${window.ticketData.departureTime}`, 120, 72);
    
    doc.text(`To: ${window.ticketData.toStation}`, 20, 79);
    doc.text(`Arrival: ${window.ticketData.arrivalDate} at ${window.ticketData.arrivalTime}`, 120, 79);
    
    // Add passenger information
    doc.setFontSize(12);
    doc.text("Passenger Details:", 20, 90);
    
    // Table headers
    doc.setFontSize(10);
    doc.text("No.", 20, 97);
    doc.text("Name", 35, 97);
    doc.text("Age", 85, 97);
    doc.text("Gender", 100, 97);
    doc.text("Seat", 125, 97);
    doc.text("Status", 145, 97);
    
    // Add line under headers
    doc.line(20, 99, 190, 99);
    
    // Add passenger data
    let yPos = 105;
    window.ticketData.passengers.forEach((passenger, index) => {
        doc.text(`${index + 1}`, 20, yPos);
        doc.text(`${passenger.name}`, 35, yPos);
        doc.text(`${passenger.age}`, 85, yPos);
        doc.text(`${passenger.gender}`, 100, yPos);
        doc.text(`${passenger.seatNumber}`, 125, yPos);
        doc.text(`${passenger.status}`, 145, yPos);
        yPos += 7;
    });
    
    // Add line after passenger data
    doc.line(20, yPos, 190, yPos);
    yPos += 10;
    
    // Add fare details
    doc.setFontSize(12);
    doc.text("Fare Details:", 20, yPos);
    yPos += 7;
    
    doc.setFontSize(10);
    doc.text(`Base Fare: ₹${window.ticketData.baseFare}`, 20, yPos);
    yPos += 7;
    doc.text(`Reservation Charges: ₹${window.ticketData.reservationCharges}`, 20, yPos);
    yPos += 7;
    doc.text(`GST: ₹${window.ticketData.gst}`, 20, yPos);
    yPos += 7;
    doc.text(`Total Amount: ₹${window.ticketData.totalAmount}`, 20, yPos);
    
    // Add footer
    yPos += 15;
    doc.setFontSize(8);
    doc.text("This is a computer-generated e-ticket and does not require a signature.", 105, yPos, { align: "center" });
    
    // Save the PDF
    doc.save(`IR_Ticket_${window.ticketData.pnr}.pdf`);
}

// Print ticket
function printTicket() {
    window.print();
}

// Email ticket (mock function)
function emailTicket() {
    const email = prompt("Please enter your email address:");
    
    if (!email) {
        alert("Email address is required to send the ticket.");
        return;
    }
    
    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    
    // Show sending indicator
    const originalText = emailBtn.textContent;
    emailBtn.textContent = "Sending...";
    emailBtn.disabled = true;
    
    // Simulate sending (would be replaced with actual API call)
    setTimeout(() => {
        alert(`Ticket has been sent to ${email}`);
        emailBtn.textContent = originalText;
        emailBtn.disabled = false;
    }, 2000);
}

// Email validation helper
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Initialize the page
function init() {
    // Populate ticket details
    populateTicketDetails();
    
    // Add event listeners to buttons
    downloadBtn.addEventListener('click', downloadTicket);
    printBtn.addEventListener('click', printTicket);
    emailBtn.addEventListener('click', emailTicket);
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);