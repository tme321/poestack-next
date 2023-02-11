import StyledCard from "./styled-card";
import StyledInput from "./styled-input";

/**
 * Styled search input for filtering aggregates on the {@link Characters} page
 */
export default function StyledMultiSearch({ value, onChange }: { value: string, onChange: (e: any)=>void}) {
    return (
        <StyledCard title={"Search"}>
        <StyledInput
            value={value}
            onChange={onChange}
            placeholder="Search Filters..."
        />
        </StyledCard>
    );
}
  