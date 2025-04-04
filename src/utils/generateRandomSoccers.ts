import { MODEL as Groups } from "@/services/groups";
import { MODEL as Soccer } from "@/services/soccer";
import { MODEL as Tournamed } from "@/services/tournamed";

const COUNTRIES = [
  "Turkey",
  "Germany",
  "France",
  "Spain",
  "England",
  "Italy",
  "Netherlands",
  "Portugal",
  "Belgium",
  "Brazil",
  "Argentina",
  "Colombia",
  "Mexico",
  "USA",
  "Japan",
  "South Korea",
];

const COLORS = [
  "Red - White",
  "Blue - White",
  "Black - White",
  "Yellow - Navy Blue",
  "Green - White",
  "Orange - Black",
  "Purple - White",
  "Pink - Black",
];

const TURKISH_CLUBS = [
  { name: "Galatasaray", suffix: "SC", color: "Yellow - Red" },
  { name: "Fenerbahçe", suffix: "SC", color: "Yellow - Navy Blue" },
  { name: "Beşiktaş", suffix: "JC", color: "Black - White" },
  { name: "Trabzonspor", suffix: "FC", color: "Purple - Blue" },
  { name: "Çorumspor", suffix: "FC", color: "Red - Black" },
  { name: "Merzifon", suffix: "SC", color: "White - Blue" },
];

const TEAM_PREFIXES = [
  "Arsenal",
  "Milan",
  "Bayern Munih",
  "Borussia Dortmund",
  "PSG",
  "Celtic",
  "Real Madrid",
  "Atletico",
  "Sporting",
  "Dinamo",
  ...TURKISH_CLUBS.map((club) => club.name),
  "Paris",
  "Manchester",
  "Liverpool",
  "Ajax",
  "Inter",
  "Barcelona",
];

const TEAM_SUFFIXES = [
  "United",
  "City",
  "Club",
  "Spor",
  "Team",
  "Stars",
  "FC",
  "JC",
];

const generateSoccerName = (): string => {
  const prefix =
    TEAM_PREFIXES[Math.floor(Math.random() * TEAM_PREFIXES.length)];
  const turkishClub = TURKISH_CLUBS.find((club) => prefix.includes(club.name));

  const suffix = turkishClub
    ? turkishClub.suffix
    : TEAM_SUFFIXES[Math.floor(Math.random() * TEAM_SUFFIXES.length)];

  return `${prefix} ${suffix}`;
};

export const generateRandomSoccers = (
  count: number,
  groups: Groups[]
): Soccer[] => {
  const allTeams = Array.from({ length: count }, () => {
    const id = 0;
    const tournamed = {} as Tournamed;
    const name = generateSoccerName();
    const turkishClub = TURKISH_CLUBS.find((club) => name.includes(club.name));
    const isTurkishClub = !!turkishClub;

    const random = {
      id,
      tournamed,
      groups: null,
      name,
      country: isTurkishClub
        ? "Turkey"
        : COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)],
      power: {
        id: 0,
        field: Math.floor(Math.random() * 50) + 50,
        outfield: Math.floor(Math.random() * 50) + 50,
        power: Math.floor(Math.random() * 50) + 50,
        playing: Math.floor(Math.random() * 50) + 50,
        fortunate: Math.floor(Math.random() * 50) + 50,
      },
      colors: isTurkishClub
        ? turkishClub.color
        : COLORS[Math.floor(Math.random() * COLORS.length)],
    };

    if (random.name === "Merzifon SC") {
      random.power = {
        id: 0,
        field: 100,
        outfield: 100,
        power: 100,
        playing: 100,
        fortunate: Math.floor(Math.random() * 75) + 25,
      };
    }

    if (random.name === "Çorumspor FC") {
      random.power = {
        id: 0,
        field: 100,
        outfield: 100,
        power: 100,
        playing: 100,
        fortunate: Math.floor(Math.random() * 75) + 25,
      };
    }

    return random;
  });

  const shuffledTeams = [...allTeams].sort(() => Math.random() - 0.5);

  const teamsPerGroup = Math.floor(count / groups.length);

  return groups.flatMap((group, groupIndex) => {
    const startIndex = groupIndex * teamsPerGroup;
    const endIndex = startIndex + teamsPerGroup;
    return shuffledTeams.slice(startIndex, endIndex).map((team) => ({
      ...team,
      groups: group,
    }));
  });
};
