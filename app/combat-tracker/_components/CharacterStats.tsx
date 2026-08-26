import { CombatCharacter } from '../page';
import styles from './character-stats.module.scss';

type CharacterStatsProps = {
  character: CombatCharacter;
  [key: string]: unknown;
}

const CharacterStats = ({ character, ...restProps }: CharacterStatsProps) => {
  const { name, hp, maxHp, ac, initScore, spellSlotsLefts } = character;
  const hpPercent = maxHp > 0 ? (hp / maxHp) * 100 : 0;
  const emptyStatClass = [styles["character-stats__stat--low"], styles["character-stats__stat"]].join(' ');
  const isDead = hp < 0;
  const isDying = hp === 0;
  
  const getHpClass = () => {
    let className = styles["character-stats__stat--low"];
    if (hpPercent > 75) className = styles["character-stats__stat--high"];
    if (hpPercent >= 25) className = styles["character-stats__stat--medium"];
    return [className, styles["character-stats__stat"]].join(' ');
  }

  return (
    <div className={styles["character-stats"]} {...restProps}>
      <h3 className={styles["character-stats__line"]}>{isDying && <>💀 </>}{isDead && <>☠️ </>}{name}</h3>
      <div className={styles["character-stats__line"]}>
        <p><span className={styles["character-stats__line__icon"]}>💉</span> PV : <span  className={getHpClass()}>{hp}</span> / {maxHp}</p>
        <p><span className={styles["character-stats__line__icon"]}>🛡️</span> CA : {ac}</p>
        <p><span className={styles["character-stats__line__icon"]}>🎲</span> Initiative : {initScore}</p>
      </div>
      {spellSlotsLefts && Object.entries(spellSlotsLefts).length > 0 && ( 
        <div className={[styles["character-stats__line--vertical"], styles["character-stats__line"]].join(' ')}>
          <p><span className={styles["character-stats__line__icon"]}>🧙‍♂️</span> Emplacements de sorts :</p>
            <div className={styles["character-stats__line"]}>
            {Object.entries(spellSlotsLefts).map(([level, slots]) => (
              <div className={styles["character-stats__line--indented"]} key={level}> 🔹 niv. {level} : <span className={slots === 0 ? emptyStatClass : ''}>{slots}</span></div>
            ))}
          </div>
        </div>
      )}
      {character.states && character.states.length > 0 && (
        <div className={[styles["character-stats__line--vertical"], styles["character-stats__line"]].join(' ')}>
          <div className={styles["character-stats__line"]}>
            {character.states.map((state) => (
              <div className={styles["character-stats__line"]} key={state.name}>
                {state.name} pendant {state.numberOfTurns} tours, {state.saveThrowStat} DD {state.saveThrowThreshold}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CharacterStats;
