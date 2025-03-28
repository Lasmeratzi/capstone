import Sidebar from "../sidebar/sidebar";

const Home = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-8">
        <h1>Welcome to the Home Page!</h1>
      </div>
    </div>
  );
};

export default Home;