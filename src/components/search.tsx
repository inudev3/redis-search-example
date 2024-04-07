"use client";

import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { type Command as CommandPrimitive } from "cmdk";
import { useEffect, useState } from "react";

type SearchResults = {
	results: string[];
	duration: number;
};

export default function Search({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive>) {
	const [input, setInput] = useState<string>("");
	const [searchResults, setSearchResults] = useState<SearchResults>();

	useEffect(() => {
		const fetchData = async () => {
			if (!input) return setSearchResults(undefined);

			const res = await fetch(
				`https://speedsearch.inust33.workers.dev/api/search?q=${input}`,
			);
			const data = (await res.json()) satisfies SearchResults;
			setSearchResults(data);
		};
		fetchData();
	}, [input]);
	return (
		<Command className={className}>
			<CommandInput
				value={input}
				onValueChange={setInput}
				placeholder="Search Countries..."
				className="placeholder:text-gray-500"
			/>
			<CommandList>
				{searchResults?.results.length === 0 ? (
					<CommandEmpty>No Results found.</CommandEmpty>
				) : null}
				{searchResults?.results ? (
					<CommandGroup heading="Results">
						{searchResults?.results.map((result) => (
							<CommandItem key={result} value={result} onSelect={setInput}>
								{result}
							</CommandItem>
						))}
						{searchResults?.results ? (
							<>
								<div className="h-px w-full bg-zinc-200" />
								<p className="p-2 text-xs text-zinc-500">
									Found {searchResults.results.length} results in{" "}
									{searchResults?.duration.toFixed(0)}ms
								</p>
							</>
						) : null}
					</CommandGroup>
				) : null}
			</CommandList>
		</Command>
	);
}
