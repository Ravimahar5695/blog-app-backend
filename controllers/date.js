exports.date = () => {
    const monthNames = ["Jan", "Feb", "March", "April", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fre", "Sat"];
    const today = new Date();
    const day = dayNames[today.getDay()] + " " + today.getDate() + " " + monthNames[today.getMonth()] + " " + today.getFullYear();
    return day;
}