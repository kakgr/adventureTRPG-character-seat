import { calculateDamageBonus, calculateHp, calculateMp, calculateSanity, totalSkillValue, totalStatValue } from "./characterRules";
import type { CharacterRecord, EquipmentItem } from "../types/character";
import { COMMON_SKILLS } from "../constants/game";

type BattleExport = { schemaVersion: 1; characterId: string; name: string; stats: { vit:number; str:number; pow:number; dex:number; mnd:number; maxHp:number; maxMp:number; sanity:number; damageBonus:number; speed:number; baseDefense:number }; skills: Array<{id:string;category:"normal"|"weapon"|"magic"|"other";name:string;value:number}>; weaponLoadout: Array<{weaponId:string;skillId:string}>; accessoryLoadout: Array<{accessoryId:string}>; guards: Array<{name:string;value:number}> };
const valid=(id:string|undefined,prefix:string)=>!!id&&new RegExp(`^${prefix}\\d{4}$`).test(id);
const equipped=(character:CharacterRecord)=>character.data.equipment.filter(item=>character.data.equippedEquipmentIds.includes(item.id));
const fail=(message:string):never=>{throw new Error(message)};
const skillCategory=(item:EquipmentItem)=>item.category==="melee"?"0":"1";

export function buildBattleExport(character:CharacterRecord):BattleExport {
  const {data}=character, items=equipped(character), weapons=items.filter(item=>["melee","gun","bow"].includes(item.category));
  for(const item of weapons){if(!valid(item.referenceId,"3"))fail(`${item.name||"名称未設定の武器"}のIDは3xxxxで入力してください`);if(!valid(item.skillReferenceId,skillCategory(item)))fail(`${item.name||"名称未設定の武器"}の使用技能を選択してください`);}
  for(const item of items.filter(item=>item.category==="accessory"))if(!valid(item.referenceId,"5"))fail(`${item.name||"名称未設定のアクセサリー"}のIDは5xxxxで入力してください`);
  for(const item of items.filter(item=>item.category==="shield"))if(!valid(item.referenceId,"4"))fail(`${item.name||"名称未設定の盾"}のIDは4xxxxで入力してください`);
  const skills=[...COMMON_SKILLS.map(skill=>({id:skill.id,category:"normal" as const,name:skill.label,value:totalSkillValue(data.skills.common[skill.id],data.skills.bonuses.common[skill.id])})),{id:"luck",category:"normal" as const,name:"幸運",value:data.skills.luck},...data.skills.weapon.filter(skill=>valid(skill.referenceId,"0")).map(skill=>({id:skill.referenceId!,category:"weapon" as const,name:skill.specialty,value:totalSkillValue(skill.value,data.skills.bonuses.weapon[skill.id])})),...data.skills.ranged.filter(skill=>valid(skill.referenceId,"1")).map(skill=>({id:skill.referenceId!,category:"weapon" as const,name:skill.specialty,value:totalSkillValue(skill.value,data.skills.bonuses.ranged[skill.id])})),...data.skills.magic.filter(skill=>valid(skill.referenceId,"2")).map(skill=>({id:skill.referenceId!,category:"magic" as const,name:skill.specialty,value:totalSkillValue(skill.value,data.skills.bonuses.magic[skill.id])}))];
  const baseDefense=items.filter(item=>item.category==="armor").reduce((sum,item)=>sum+(item.defense??0),0);
  return {schemaVersion:1,characterId:character.id,name:character.name,stats:{vit:totalStatValue(data.stats,data.statBonuses,"vitality"),str:totalStatValue(data.stats,data.statBonuses,"strength"),pow:totalStatValue(data.stats,data.statBonuses,"magic"),dex:totalStatValue(data.stats,data.statBonuses,"speed"),mnd:totalStatValue(data.stats,data.statBonuses,"mental"),maxHp:calculateHp(data.stats,data.statBonuses),maxMp:calculateMp(data.stats,data.statBonuses),sanity:calculateSanity(data.stats,data.statBonuses),damageBonus:calculateDamageBonus(data.stats,data.statBonuses),speed:totalStatValue(data.stats,data.statBonuses,"speed"),baseDefense},skills,weaponLoadout:weapons.map(item=>({weaponId:item.referenceId!,skillId:item.skillReferenceId!})),accessoryLoadout:items.filter(item=>item.category==="accessory").map(item=>({accessoryId:item.referenceId!})),guards:items.filter(item=>item.category==="shield").map(item=>({name:item.name,value:item.durability??0}))};
}
export const serializeBattleExport=(value:BattleExport)=>JSON.stringify(value);
