import { OutboundMap } from "./OutboundMap";


export function Main() {
  return (
    <div className="min-h-screen bg-gray-100">
      <OutboundMap />
      <footer className="bg-gray-50 dark:bg-gray-900 text-wrap">
        <div className="max-w-full w-full items-center px-2 sm:pr-10">
        The assets comes from Outbound or from Square Glade Games, who hold the copyright of Outbound. All trademarks and registered trademarks and logos present in the image are proprietary to Square Glade Games. 
        All trademarks, service marks, trade names, product names and logos appearing on this site are the property of their resepective owners.
        </div>
      </footer>
    </div>
  );
}
