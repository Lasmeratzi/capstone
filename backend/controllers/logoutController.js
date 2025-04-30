const logoutUser = (req, res) => {
    res.status(200).json({
      message: "Logout successful. Please clear your token from storage.",
    });
  };
  
  module.exports = {
    logoutUser,
  };