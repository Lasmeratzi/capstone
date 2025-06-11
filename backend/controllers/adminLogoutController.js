const logoutAdmin = (req, res) => {
    console.log(`Admin ${req.admin?.username || "Unknown"} logging out.`); // ✅ Debugging log

    // ✅ Explicitly instruct frontend to clear session storage
    res.status(200).json({
        message: "Admin logout successful.",
        clearSession: true, // ✅ Frontend can use this flag to clear sessionStorage
    });
};

module.exports = { logoutAdmin };