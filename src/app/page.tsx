import Link from "next/link";

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-2xl font-bold'>Go to Page: </h1>
      <div className='grid grid-cols-1 gap-2'>
        <Link
          href='/portal/dashboard'
          className='bg-blue-500 text-white p-2 rounded-md'
        >
          Dashboard
        </Link>
        <Link
          href='/portal/do'
          className='bg-blue-500 text-white p-2 rounded-md'
        >
          Delivery Orders
        </Link>
        <Link
          href='/portal/locations'
          className='bg-blue-500 text-white p-2 rounded-md'
        >
          Locations
        </Link>
        <Link
          href='/portal/parties'
          className='bg-blue-500 text-white p-2 rounded-md'
        >
          Parties
        </Link>
      </div>
    </div>
  );
}
