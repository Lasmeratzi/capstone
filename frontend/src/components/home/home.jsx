import Sidebar from "../sidebar/sidebar"; // Ensure the path is correct

const Home = () => {
  return (
    <div className="flex h-screen bg-gray-200">
      {/* Sidebar */}
      <Sidebar className="w-64 bg-gray-800 text-white flex-none" />

      {/* Main Content */}
      <div className="flex flex-grow justify-center items-center">
        <div className="w-full max-w-[600px] space-y-4">
          {/* Post Input Section */}
          <div className="bg-gray-300 p-4 shadow-md border border-gray-500">
            <p>Post something...</p>
            <div className="flex space-x-2 mt-2">
              <button className="bg-blue-600 text-white px-4 py-1 border border-black">
                Photo/Video
              </button>
              <button className="bg-blue-600 text-white px-4 py-1 border border-black">
                GIF
              </button>
            </div>
          </div>

          {/* Feed Post */}
          <div className="bg-gray-400 h-64 shadow-md border border-gray-500"></div>

          {/* Another Feed Post */}
          <div className="bg-gray-400 h-32 shadow-md border border-gray-500"></div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-64 bg-blue-900 p-4 border-4 border-red-500 relative">
        <div className="absolute bottom-4 left-4 right-4 bg-white h-10 border border-black"></div>
      </div>
    </div>
  );
};

export default Home;
