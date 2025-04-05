const logoutUser = (req, res) => {
    // Handle any backend-specific logout tasks, if needed
    // For example, invalidate tokens in a database or a server-side session
  
    res.status(200).json({ message: "Logout successful!" });
  };
  
  module.exports = { logoutUser };