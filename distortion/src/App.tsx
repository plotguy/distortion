import "./App.css";
import Layout from "./components/Layout";

function App() {
  return (
    <div className="bg-gradient-to-bl from-[#2e026d] to-[#15162c] p-16 flex flex-col">
      <span className="text-yellow-500 text-5xl font-extralight mb-8 ml-36">
        Distortion
      </span>

      <div className="flex h-screen flex-col items-center ">
        <Layout />
      </div>
    </div>
  );
}

export default App;
