export const PLAYER_KNOWLEDGE = Object.freeze({
  mai_tai_tasted: 'mai_tai_tasted',
  mai_tai_problem: 'mai_tai_problem',
  mai_tai_ingredient: 'mai_tai_ingredient',
  mai_tai_supplied: 'mai_tai_supplied',
  juan_bar_drink: 'juan_bar_drink',
  juan_goal_explained: 'juan_goal_explained',
  juan_route: 'juan_route',
});

export const knows = (world, key) => world.playerGame.knowledge?.includes(key) ?? false;

export function learn(world, key) {
  world.playerGame.knowledge ??= [];
  if (!knows(world, key)) world.playerGame.knowledge.push(key);
  return world;
}
