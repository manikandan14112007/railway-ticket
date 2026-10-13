/**
 * Train Schedules & Routes Dataset
 */

const TRAIN_DATABASE = [
    {
        id: "TR-12001",
        number: "22436",
        name: "Vande Bharat Bullet Express",
        type: "High-Speed Superfast",
        speed: "180 km/h",
        badge: "Fastest / Bullet Tech",
        departure: "06:00 AM",
        arrival: "02:15 PM",
        duration: "8h 15m",
        from: "New Delhi (NDLS)",
        to: "Varanasi Jn (BSB)",
        availableDays: ["Mon", "Tue", "Wed", "Fri", "Sat", "Sun"],
        classes: [
            { code: "EC", name: "Exec. Chair Car", price: 2450, available: 38, status: "Available" },
            { code: "CC", name: "AC Chair Car", price: 1420, available: 114, status: "Available" }
        ],
        foodIncluded: true,
        punctuality: "99.2%"
    },
    {
        id: "TR-12002",
        number: "12952",
        name: "Rajdhani Super Bullet Express",
        type: "Bullet Premier Express",
        speed: "160 km/h",
        badge: "Premier Luxury",
        departure: "04:55 PM",
        arrival: "08:35 AM",
        duration: "15h 40m",
        from: "New Delhi (NDLS)",
        to: "Mumbai Central (MMCT)",
        availableDays: ["All Days"],
        classes: [
            { code: "1A", name: "AC First Class", price: 4780, available: 14, status: "Available" },
            { code: "2A", name: "AC 2-Tier", price: 2890, available: 42, status: "Available" },
            { code: "3A", name: "AC 3-Tier", price: 1980, available: 95, status: "Available" }
        ],
        foodIncluded: true,
        punctuality: "98.5%"
    },
    {
        id: "TR-12003",
        number: "20607",
        name: "Mysuru - Chennai Bullet Express",
        type: "High-Speed Rail",
        speed: "160 km/h",
        badge: "Popular Route",
        departure: "05:50 AM",
        arrival: "10:25 AM",
        duration: "4h 35m",
        from: "Chennai Central (MAS)",
        to: "Bengaluru City (SBC)",
        availableDays: ["All Days except Wed"],
        classes: [
            { code: "EC", name: "Executive Class", price: 1950, available: 22, status: "Available" },
            { code: "CC", name: "AC Chair Car", price: 990, available: 86, status: "Available" }
        ],
        foodIncluded: true,
        punctuality: "99.8%"
    },
    {
        id: "TR-12004",
        number: "12009",
        name: "Shatabdi High-Speed Express",
        type: "Express Bullet",
        speed: "150 km/h",
        badge: "Morning Priority",
        departure: "06:20 AM",
        arrival: "12:45 PM",
        duration: "6h 25m",
        from: "Mumbai Central (MMCT)",
        to: "Ahmedabad Jn (ADI)",
        availableDays: ["All Days except Sun"],
        classes: [
            { code: "EC", name: "Exec. Chair Car", price: 2150, available: 29, status: "Available" },
            { code: "CC", name: "AC Chair Car", price: 1100, available: 120, status: "Available" }
        ],
        foodIncluded: true,
        punctuality: "97.9%"
    },
    {
        id: "TR-12005",
        number: "12246",
        name: "Duronto Non-Stop Superfast",
        type: "Non-Stop High Speed",
        speed: "140 km/h",
        badge: "Fastest Non-Stop",
        departure: "11:00 AM",
        arrival: "04:15 PM",
        duration: "29h 15m",
        from: "Bengaluru (YPR)",
        to: "Howrah Jn (HWH)",
        availableDays: ["Tue", "Thu", "Fri", "Sun"],
        classes: [
            { code: "1A", name: "AC First Class", price: 4620, available: 8, status: "Available" },
            { code: "2A", name: "AC 2-Tier", price: 2750, available: 31, status: "Available" },
            { code: "3A", name: "AC 3-Tier", price: 1850, available: 64, status: "Available" },
            { code: "SL", name: "Sleeper Class", price: 790, available: 18, status: "RAC 12" }
        ],
        foodIncluded: true,
        punctuality: "96.4%"
    },
    {
        id: "TR-12006",
        number: "22625",
        name: "Double Decker Bullet Shuttle",
        type: "Air Conditioned Intercity",
        speed: "130 km/h",
        badge: "Double Decker",
        departure: "07:25 AM",
        arrival: "01:10 PM",
        duration: "5h 45m",
        from: "Chennai Central (MAS)",
        to: "Bengaluru City (SBC)",
        availableDays: ["All Days"],
        classes: [
            { code: "CC", name: "AC Chair Car", price: 620, available: 210, status: "Available" }
        ],
        foodIncluded: false,
        punctuality: "98.1%"
    },
    {
        id: "TR-12007",
        number: "12015",
        name: "Ajmer Bullet Shatabdi",
        type: "High-Speed Superfast",
        speed: "140 km/h",
        badge: "Express Service",
        departure: "06:10 AM",
        arrival: "10:40 AM",
        duration: "4h 30m",
        from: "New Delhi (NDLS)",
        to: "Jaipur Jn (JP)",
        availableDays: ["All Days"],
        classes: [
            { code: "EC", name: "Exec. Chair Car", price: 1720, available: 45, status: "Available" },
            { code: "CC", name: "AC Chair Car", price: 890, available: 130, status: "Available" }
        ],
        foodIncluded: true,
        punctuality: "99.1%"
    },
    {
        id: "TR-12008",
        number: "12626",
        name: "Kerala Superfast Express",
        type: "Superfast Long Distance",
        speed: "120 km/h",
        badge: "Daily Service",
        departure: "08:10 PM",
        arrival: "02:40 PM",
        duration: "42h 30m",
        from: "New Delhi (NDLS)",
        to: "Thiruvananthapuram (TVC)",
        availableDays: ["All Days"],
        classes: [
            { code: "2A", name: "AC 2-Tier", price: 3450, available: 19, status: "Available" },
            { code: "3A", name: "AC 3-Tier", price: 2310, available: 58, status: "Available" },
            { code: "SL", name: "Sleeper Class", price: 910, available: 112, status: "Available" }
        ],
        foodIncluded: false,
        punctuality: "95.8%"
    }
];

const STATIONS_LIST = [
    { code: "NDLS", name: "New Delhi", state: "Delhi" },
    { code: "MMCT", name: "Mumbai Central", state: "Maharashtra" },
    { code: "MAS", name: "Chennai Central", state: "Tamil Nadu" },
    { code: "SBC", name: "Bengaluru City", state: "Karnataka" },
    { code: "HWH", name: "Howrah Jn (Kolkata)", state: "West Bengal" },
    { code: "ADI", name: "Ahmedabad Jn", state: "Gujarat" },
    { code: "BSB", name: "Varanasi Jn", state: "Uttar Pradesh" },
    { code: "JP", name: "Jaipur Jn", state: "Rajasthan" },
    { code: "HYB", name: "Hyderabad Deccan", state: "Telangana" },
    { code: "PUNE", name: "Pune Jn", state: "Maharashtra" },
    { code: "TVC", name: "Thiruvananthapuram", state: "Kerala" }
];

window.TRAIN_DATABASE = TRAIN_DATABASE;
window.STATIONS_LIST = STATIONS_LIST;
