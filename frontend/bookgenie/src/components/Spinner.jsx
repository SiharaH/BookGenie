import { LoaderCircle } from "lucide-react";

function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen">
      <LoaderCircle className="animate-spin w-10 h-10 text-blue-500" />
    </div>
  );
}

export default Spinner;