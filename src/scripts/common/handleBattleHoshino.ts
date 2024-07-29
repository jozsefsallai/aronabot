export function handleBattleHoshino(studentIds: string[]): string[] {
  const newStudentIds = [];

  for (const id of studentIds) {
    if (id === 'hoshino_battle') {
      newStudentIds.push('hoshino_battle_tank');
      newStudentIds.push('hoshino_battle_dealer');
    } else {
      newStudentIds.push(id);
    }
  }

  return newStudentIds;
}
