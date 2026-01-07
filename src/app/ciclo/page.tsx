"use client";

import { useState } from "react";
import { CycleSubject } from "@/types";

export default function Ciclo() {
	const [subjects, setSubjects] = useState<CycleSubject[]>([
		{ id: "1", name: "Português", durationMinutes: 60, color: "primary" },
		{ id: "2", name: "Raciocínio Lógico", durationMinutes: 90, color: "primary" },
	]);
	const [newName, setNewName] = useState("");
	const [newDuration, setNewDuration] = useState<number | string>(60);

	function handleAddSubject() {
		if (newName.trim() === "" || newDuration === "") return;
		const newSubject = {
			id: Date.now().toString(),
			name: newName,
			durationMinutes: Number(newDuration),
			color: "neutral",
		};
		setSubjects([...subjects, newSubject]);
		setNewName("");
		setNewDuration(60);
	}

	function handleDelete(id: string) {
		setSubjects(subjects.filter((subject) => subject.id !== id));
	}

	return (
		<div className=" flex flex-col gap-4">
			<h1>Meu Ciclo</h1>
			<div className="flex gap-2 mb-4">
				<input
					type="text"
					placeholder="Nome da matéria"
					className="input input-bordered w-full"
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
				/>
				<input
					type="number"
					className="input input-bordered w-24"
					value={newDuration}
					min={0}
					onChange={(e) => {
						const val = e.target.value;
						setNewDuration(val === "" ? "" : Number(val));
					}}
				/>
				<button className="btn btn-primary" onClick={handleAddSubject}>
					Adicionar
				</button>
			</div>
			{subjects.map((subject) => (
				<div key={subject.id} className="card bg-base-100 shadow-sm border p-4">
					<strong>{subject.name}</strong>
					<p>{subject.durationMinutes}</p>
					<button className="btn btn-error btn-xs" onClick={() => handleDelete(subject.id)}>
						Excluir
					</button>
				</div>
			))}
		</div>
	);
}
