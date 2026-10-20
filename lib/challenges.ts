/** Product challenge catalog — mock-gold stakes until Stripe cash rails land. */

export type Challenge = {
  id: string
  tab: "Challenges" | "Roulette" | "Events"
  kicker: string
  title: string
  summary: string
  rewardLabel: string
  fundUsd: number
  entryUsd: number
  endsIn: string
  task: string
  hostHandle: string
}

export const CHALLENGES: Challenge[] = [
  {
    id: "1",
    tab: "Challenges",
    kicker: "FEATURED",
    title: "Spicy Truth",
    summary: "Complete the timed dare on camera. Lord picks the winner.",
    rewardLabel: "$250",
    fundUsd: 250,
    entryUsd: 5,
    endsIn: "02:15:42",
    task: "Eat a ghost pepper in 60 seconds on camera, start to finish.",
    hostHandle: "court",
  },
  {
    id: "2",
    tab: "Roulette",
    kicker: "ROULETTE · SPINS EVERY 5 MIN",
    title: "Blind Give",
    summary: "Random recipient. Random amount. No takebacks.",
    rewardLabel: "$25–$500",
    fundUsd: 100,
    entryUsd: 5,
    endsIn: "00:04:18",
    task: "Pour a blind gift to a random open beg within five minutes.",
    hostHandle: "court",
  },
  {
    id: "3",
    tab: "Events",
    kicker: "EVENT · WEEKEND",
    title: "Midnight Marathon",
    summary: "Six hours live. Highest pour total takes the pot.",
    rewardLabel: "$5,000",
    fundUsd: 500,
    entryUsd: 10,
    endsIn: "2D 06:00",
    task: "Stay live for six hours. Highest gift total wins the pot.",
    hostHandle: "court",
  },
]

export function challengeById(id: string | undefined): Challenge {
  return CHALLENGES.find((c) => c.id === String(id)) ?? CHALLENGES[0]
}
