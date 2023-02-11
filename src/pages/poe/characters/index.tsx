import { useState, useEffect, Dispatch } from "react";
import { gql, useQuery } from "@apollo/client";
import client from "../../../poe-stack-apollo-client";
import {
  CharacterSnapshotSearchResponse,
  CharacterSnapshotSearchAggregationsResponse,
} from "../../../__generated__/resolvers-types";
import { usePoeLeagueCtx } from "../../../contexts/league-context";
import {
  CharacterSnapshotSearch,
} from "../../../__generated__/resolvers-types";
import StyledAggregatorPanel, { StyledAggregatorPanelModel } from "../../../components/styled-aggregator-panel";
import StyledMultiSearch from "../../../components/styled-multi-search";
import StyledCharactersSummaryTable from "../../../components/styled-characters-summary-table";

const generalSearch = gql`
  query Snapshots($search: CharacterSnapshotSearch!) {
    characterSnapshotsSearch(search: $search) {
      snapshots {
        characterId
        name
        level
        mainSkillKey
        characterClass
        energyShield
        life
      }
      hasMore
    }
    characterSnapshotsSearchAggregations(search: $search) {
      totalMatches
      characterClassAggregation {
        values {
          key
          value
        }
      }
      keystoneAggregation {
        values {
          key
          value
        }
      }
      mainSkillAggreagtion {
        values {
          value
          key
        }
      }
      itemKeyAggreagtion {
        values {
          value
          key
        }
      }
    }
  }
`;

/**
 * Characters page
 */
export default function Characters({
  initialSearchResponse,
  unqiueKeysResponse,
}) {
  const { league } = usePoeLeagueCtx();

  const [search, setSearch] = useState<CharacterSnapshotSearch>({
    league: league,
    includedKeyStoneNames: [],
    excludedKeyStoneNames: [],
    includedCharacterClasses: [],
    excludedCharacterClasses: [],
    includedMainSkills: [],
    excludedMainSkills: [],
    includedItemKeys: [],
    excludedItemKeys: [],
  });

  const [localSearchString, setLocalSearchString] = useState<string>("");

  const [characters, setCharacters] = useState<
    CharacterSnapshotSearchResponse | undefined | null
  >(initialSearchResponse?.characterSnapshotsSearch);

  const [aggregations, setAggregations] = useState<
    CharacterSnapshotSearchAggregationsResponse | undefined | null
  >(initialSearchResponse?.characterSnapshotsSearchAggregations);

  const { refetch: reftechGeneralSearch } = useQuery(
    generalSearch, 
    {
      skip: true,
      variables: { search: { ...search, ...{ league: league } } },
      onCompleted(data) {
        setCharacters({
          ...characters,
          ...data.characterSnapshotsSearch,
        });
        setAggregations({
          ...aggregations,
          ...data.characterSnapshotsSearchAggregations,
        });
      },
    });

  useEffect(() => {
    reftechGeneralSearch();
  }, [search, reftechGeneralSearch, league]);

  if (!characters) {
    return <>Loading...</>;
  }

  /*
   * Define callbacks as functions instead of consts
   * to skip revaluation on every component view update.
   */

  function updateIncludeExclude (
    search: CharacterSnapshotSearch, 
    setSearch:Dispatch<any>, 
    entry: {key: string, value: any}, 
    includedKey: string, 
    excludedKey: string): void {
  
      if (search[includedKey]?.includes(entry.key)) {
        setSearch({
          ...search,
          ...{
            [excludedKey]: [...search[excludedKey]!, entry.key],
            [includedKey]: search[includedKey]!.filter((e: string) => e !== entry.key),
          },
        });
      } else if (search[excludedKey]?.includes(entry.key)) {
        setSearch({
          ...search,
          ...{
            [excludedKey]: search[excludedKey]!.filter((e: string) => e !== entry.key),
          },
        });
      } else {
        setSearch({
          ...search,
          ...{
            [includedKey]: [...search[includedKey]!, entry.key],
          },
        });
      }
  }

  function onSkillChange(mainSkill: {key: string, value: any}) {
    updateIncludeExclude( search, setSearch,
      mainSkill,
      "includedMainSkills",
      "excludedMainSkills"
    )
  }

  function onClassChange(characterClass: {key: string, value: any}) {
    updateIncludeExclude( search, setSearch,
      characterClass,
      "includedCharacterClasses",
      "excludedCharacterClasses"
    );
  }

  function onItemChange(item: {key: string, value: any}) {
    updateIncludeExclude( search, setSearch,
      item,
      "includedItemKeys",
      "excludedItemKeys"
    );
  }

  function onKeystoneChange(keyStone: {key: string, value: any}) {
    updateIncludeExclude( search, setSearch,
      keyStone,
      "includedKeyStoneNames",
      "excludedKeyStoneNames"
    );
  }

  /*
   * These models are used to create the individual
   * aggregation panels
   */

  const aggregatorPanels: Array<StyledAggregatorPanelModel> = [{       
    title:"Skills",
    aggregation:aggregations?.mainSkillAggreagtion,
    onSelectionChanged: onSkillChange,
    includedRows:search.includedMainSkills!,
    excludedRows:search.excludedMainSkills!,
    keys: unqiueKeysResponse?.mainSkillKeys,
    matches: aggregations?.totalMatches,
    searchString: localSearchString
  },
  {
    title: "Class",
    aggregation: aggregations?.characterClassAggregation,
    onSelectionChanged: onClassChange,
    includedRows: search.includedCharacterClasses!,
    excludedRows: search.excludedCharacterClasses!,
    keys: unqiueKeysResponse?.characterClassKeys,
    matches: aggregations?.totalMatches,
    searchString: localSearchString
  },
  {
    title: "Items",
    aggregation: aggregations?.itemKeyAggreagtion,
    onSelectionChanged: onItemChange,
    includedRows: search.includedItemKeys!,
    excludedRows: search.excludedItemKeys!,
    keys: unqiueKeysResponse?.itemKeys,
    matches: aggregations?.totalMatches,
    searchString: localSearchString
  },
  {
    title: "Keystones",
    aggregation: aggregations?.keystoneAggregation,
    onSelectionChanged: onKeystoneChange,
    includedRows: search.includedKeyStoneNames!,
    excludedRows: search.excludedKeyStoneNames!,
    keys: unqiueKeysResponse?.keystoneKeys,
    matches: aggregations?.totalMatches,
    searchString: localSearchString
  }];

  return (
    <>
      <div className="flex flex-row space-x-2 ">
        <div className="flex flex-col space-y-2 w-1/6 lg:w-1/5">
          
          <StyledMultiSearch value={localSearchString} onChange={(e) => { setLocalSearchString(e); }}/>

          {aggregatorPanels.map(props=><StyledAggregatorPanel key={props.title} {...props}/>)}
          
        </div>

        <StyledCharactersSummaryTable characters={characters}/>

      </div>
    </>
  );
}

/*
 * For ssr 
 */

const uniqueKeysQuery = gql`
  query CharacterSnapshotsUniqueAggregationKeys($league: String!) {
    characterSnapshotsUniqueAggregationKeys(league: $league) {
      characterClassKeys
      keystoneKeys
      mainSkillKeys
      itemKeys
    }
  }
`;

export async function getServerSideProps({ req, res, query }) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=1200"
  );

  const resp = {
    props: {},
  };

  const { league } = query;

  const generalSearchResult: any = await client.query({
    query: generalSearch,
    variables: {
      search: {
        league: league ?? "Sanctum",
        includedKeyStoneNames: [],
        excludedKeyStoneNames: [],
        includedCharacterClasses: [],
        excludedCharacterClasses: [],
        includedMainSkills: [],
        excludedMainSkills: [],
        includedItemKeys: [],
        excludedItemKeys: [],
      },
    },
  });
  if (generalSearchResult?.data) {
    resp.props["initialSearchResponse"] = generalSearchResult?.data;
  }

  const unqiueKeysResult: any = await client.query({
    query: uniqueKeysQuery,
    variables: {
      league: league,
    },
  });
  if (unqiueKeysResult?.data?.characterSnapshotsUniqueAggregationKeys) {
    resp.props["unqiueKeysResponse"] =
      unqiueKeysResult?.data?.characterSnapshotsUniqueAggregationKeys;
  }

  return resp;
}