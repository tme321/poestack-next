import { Maybe } from "graphql/jsutils/Maybe";
import { GenericAggregation } from "../__generated__/resolvers-types";
import CharacterAggregationDisplay from "./character-aggregation-display";
import StyledCard from "./styled-card";

type StyledAggregatorPanelProps = {
    title: string;
    aggregation: GenericAggregation | undefined | null;
    onSelectionChanged: (e:{key: string, value: any})=>void;
    includedRows?: any[];
    excludedRows?: any[];
    keys: string[];
    matches?: Maybe<number>;
    searchString: string;
};

/**
 * A model of the {@link StyledAggregatorPanel} props to instantiate
 * with.
 */
export type StyledAggregatorPanelModel = StyledAggregatorPanelProps;

/**
 * Panel for  showing aggregate usage of 
 * passed fields. 
 */
export default function StyledAggregatorPanel({
    title,
    aggregation,
    onSelectionChanged,
    includedRows,
    excludedRows,
    keys,
    matches,
    searchString }: StyledAggregatorPanelProps) {

        keys = keys? keys:[];
        matches = matches? matches:0;
        
        return (
            <StyledCard title={title} className="h-[400px]">
                <CharacterAggregationDisplay
                    aggregation={aggregation}
                    onSelectionChanged={onSelectionChanged}
                    includedRows={includedRows}
                    excludedRows={excludedRows}
                    allKeys={keys}
                    totalMatches={matches}
                    localSearchString={searchString}/>
            </StyledCard>
        )
}