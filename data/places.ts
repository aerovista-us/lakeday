export type LakePlace = {
  id: string;
  name: string;
  type: "boat-launch" | "beach" | "paddle-launch";
  address: string;
  summary: string;
  sourceUrl: string;
  directionsUrl: string;
  verifiedAt: string;
  notes: string[];
};

const verifiedAt = "2026-08-21T19:08:00-07:00";

export const lakePlaces: LakePlace[] = [
  {
    id: "third-street-boat-ramp",
    name: "3rd Street Boat Ramp",
    type: "boat-launch",
    address: "208 S 3rd Street, Coeur d'Alene, ID",
    summary: "Downtown public boat ramp and launch dock between Tubbs Hill and the Coeur d'Alene Resort.",
    sourceUrl: "https://www.cdaid.org/government/departments/parks-and-recreation/park-facility-list/third-street-mooring-dock/",
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=208+S+3rd+Street+Coeur+d%27Alene+ID",
    verifiedAt,
    notes: ["20-minute limit at launch docks.", "$10 in-state / $12 out-of-state launch fee listed by the City when verified.", "Idaho invasive-species permit requirements apply to vessels operating on Idaho waterways."]
  },
  {
    id: "independence-point",
    name: "Independence Point",
    type: "beach",
    address: "105 Northwest Boulevard, Coeur d'Alene, ID",
    summary: "Downtown lakefront beach and designated swim area connected to City Park.",
    sourceUrl: "https://www.cdaid.org/government/departments/parks-and-recreation/park-facility-list/independence-point/",
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=105+Northwest+Boulevard+Coeur+d%27Alene+ID",
    verifiedAt,
    notes: ["Beach and swim area are listed by the City.", "Close to downtown, City Park and the resort area."]
  },
  {
    id: "atlas-mill-park",
    name: "Atlas Mill Park",
    type: "paddle-launch",
    address: "2411 N Atlas Road, Coeur d'Alene, ID",
    summary: "Riverfront park with an ADA-accessible swim area and ADA-accessible kayak launch.",
    sourceUrl: "https://www.cdaid.org/government/departments/parks-and-recreation/park-facility-list/atlas-mill-park/",
    directionsUrl: "https://www.google.com/maps/search/?api=1&query=2411+N+Atlas+Road+Coeur+d%27Alene+ID",
    verifiedAt,
    notes: ["Accessible swim area and kayak launch are listed by the City.", "Includes waterfront, picnic area, playground, restroom and Centennial Trail access."]
  }
];
