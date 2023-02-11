import Link from "next/link";
import Image from "next/image";
import { CharacterSnapshotSearchResponse } from "../__generated__/resolvers-types";
import StyledCard from "./styled-card";
import { StyledTooltip, StyledSkillImageTooltip } from "./styled-tooltip";

type StyledCharactersSummaryTableProps = {
    characters: CharacterSnapshotSearchResponse
};

/**
 * Table of a brief summary of characters on the characters page. 
 */
export default function StyledCharactersSummaryTable({characters}: StyledCharactersSummaryTableProps) {
    return (
        <StyledCard title="Characters" className="flex-1">
            <table>
                {/* Setup for adding click sort like PoeNinja */}
                <thead className="text-left">
                <tr>
                    <th className="pl-2">Name</th>
                    <th className="pl-2">Level</th>
                    <th className="pl-2">Skill</th>
                    <th className="pl-2">Life</th>
                    <th className="pl-2">Es</th>
                </tr>
                </thead>
                <tbody className="">
                {characters.snapshots.map((snapshot) => (
                    <>
                    <tr className="hover:bg-skin-primary border-y-2 border-slate-700/50">
                        <td>
                        <Link
                            href={`/poe/character/${snapshot.characterId}`}
                            className="hover:text-skin-accent hover:underline pl-3"
                        >
                            {snapshot?.name}
                        </Link>
                        </td>
                        <td>
                        <ul className="flex flex-row space-x-3 justify-left">
                            <li className="text-center list-none w-1/5">
                            {snapshot.level}
                            </li>
                            <li className="list-none">
                            <StyledTooltip
                                texts={[`${snapshot.characterClass}`]}
                                placement="right"
                                className="bg-slate-800"
                            >
                                <Image
                                src={`/assets/poe/classes/${snapshot.characterClass}.png`}
                                alt={snapshot.characterClass}
                                width={39}
                                height={30}
                                />
                            </StyledTooltip>
                            </li>
                        </ul>
                        </td>

                        <td>
                        {snapshot.mainSkillKey ? (
                            <li className="list-none">
                            <StyledSkillImageTooltip
                                texts={[`${snapshot.mainSkillKey}`]}
                                placement="left"
                                title="Skills"
                                imageString={snapshot.mainSkillKey}
                                className="bg-slate-800"
                            >
                                <Image
                                src={`/assets/poe/skill_icons/${snapshot.mainSkillKey}.png`}
                                alt=""
                                width={39}
                                height={30}
                                />
                            </StyledSkillImageTooltip>
                            </li>
                        ) : null}
                        </td>

                        <td className="font-semibold text-red-600">
                        {snapshot.life}
                        </td>
                        <td className="font-semibold text-teal-300">
                        {snapshot.energyShield}
                        </td>
                    </tr>
                    </>
                ))}
                </tbody>
            </table>
        </StyledCard>);
}
  