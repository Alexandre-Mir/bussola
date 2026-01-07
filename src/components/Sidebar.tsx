import Link from "next/link";

export default function Sidebar() {
	return (
		<aside className="w-64 bg-base-200 h-screen">
			<div className="p-4">
				<h1 className="text-2xl font-bold">Bússola</h1>
			</div>
			<ul className="menu p-4 w-full text-base-content">
				<li>
					<Link href="/">Dashboard</Link>
				</li>
				<li>
					<Link href="/ciclo">Ciclo de Estudos</Link>
				</li>
			</ul>
		</aside>
	);
}
