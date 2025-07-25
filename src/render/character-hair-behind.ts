import { type CharacterMapInfo, Direction, Gender, SitState } from 'eolib';
import { getCharacterRectangle } from '../collision';
import { GAME_WIDTH } from '../game-state';
import { getBitmapById, GfxType } from '../gfx';
import type { Vector2 } from '../vector';

const STANDING_OFFSETS = {
  [Direction.Up]: { x: 0, y: 0 },
  [Direction.Down]: { x: -2, y: 0 },
  [Direction.Left]: { x: -2, y: 0 },
  [Direction.Right]: { x: 0, y: 0 },
};

const FEMALE_WALKING_OFFSETS = {
  [Direction.Up]: { x: 0, y: 1 },
  [Direction.Down]: { x: -2, y: 1 },
  [Direction.Left]: { x: -2, y: 1 },
  [Direction.Right]: { x: 0, y: 1 },
};

const MALE_WALKING_OFFSETS = {
  [Direction.Up]: { x: 0, y: 1 },
  [Direction.Down]: { x: -1, y: 1 },
  [Direction.Left]: { x: -2, y: 1 },
  [Direction.Right]: { x: -1, y: 1 },
};

const FEMALE_ATTACK_FRAME_0_OFFSETS = {
  [Direction.Up]: { x: -1, y: 0 },
  [Direction.Down]: { x: -1, y: 0 },
  [Direction.Left]: { x: -1, y: 0 },
  [Direction.Right]: { x: -1, y: 0 },
};

const MALE_ATTACK_FRAME_0_OFFSETS = {
  [Direction.Up]: { x: -2, y: 0 },
  [Direction.Down]: { x: 0, y: 0 },
  [Direction.Left]: { x: 0, y: 0 },
  [Direction.Right]: { x: -2, y: 0 },
};

const FEMALE_ATTACK_FRAME_1_OFFSETS = {
  [Direction.Up]: { x: 3, y: 1 },
  [Direction.Down]: { x: -5, y: 5 },
  [Direction.Left]: { x: -5, y: 1 },
  [Direction.Right]: { x: 3, y: 4 },
};

const MALE_ATTACK_FRAME_1_OFFSETS = {
  [Direction.Up]: { x: 1, y: 0 },
  [Direction.Down]: { x: -6, y: 4 },
  [Direction.Left]: { x: -4, y: 1 },
  [Direction.Right]: { x: 4, y: 4 },
};

const MALE_SIT_FLOOR_OFFSETS = {
  [Direction.Up]: { x: -5, y: 0 },
  [Direction.Down]: { x: 2, y: 0 },
  [Direction.Left]: { x: 3, y: 0 },
  [Direction.Right]: { x: -3, y: 0 },
};

const FEMALE_SIT_FLOOR_OFFSETS = {
  [Direction.Up]: { x: -4, y: -2 },
  [Direction.Down]: { x: 0, y: -2 },
  [Direction.Left]: { x: 2, y: -2 },
  [Direction.Right]: { x: -2, y: -2 },
};

export function renderCharacterHairBehind(
  character: CharacterMapInfo,
  ctx: CanvasRenderingContext2D,
  animationFrame: number,
  walking: boolean,
  attacking: boolean,
) {
  if (character.hairStyle <= 0) {
    return;
  }

  const baseGfxId = (character.hairStyle - 1) * 40 + character.hairColor * 4;
  const offset =
    2 *
    ([Direction.Down, Direction.Right].includes(character.direction) ? 0 : 1);
  const gfxId = baseGfxId + 1 + offset;
  const bmp = getBitmapById(
    character.gender === Gender.Female ? GfxType.FemaleHair : GfxType.MaleHair,
    gfxId,
  );

  if (!bmp) {
    return;
  }

  const rect = getCharacterRectangle(character.playerId);
  if (!rect) {
    return;
  }

  let screenX = Math.floor(
    rect.position.x + rect.width / 2 - bmp.width / 2 + 1,
  );

  let screenY = Math.floor(
    rect.position.y -
      bmp.height +
      41 +
      (character.gender === Gender.Female ? 1 : 0),
  );

  const { direction, gender, sitState } = character;

  let additionalOffset: Vector2;
  switch (true) {
    case walking:
      additionalOffset =
        gender === Gender.Female
          ? FEMALE_WALKING_OFFSETS[direction]
          : MALE_WALKING_OFFSETS[direction];
      break;
    case attacking:
      additionalOffset =
        gender === Gender.Female
          ? animationFrame
            ? FEMALE_ATTACK_FRAME_1_OFFSETS[direction]
            : FEMALE_ATTACK_FRAME_0_OFFSETS[direction]
          : animationFrame
            ? MALE_ATTACK_FRAME_1_OFFSETS[direction]
            : MALE_ATTACK_FRAME_0_OFFSETS[direction];
      break;
    case sitState === SitState.Floor:
      additionalOffset =
        gender === Gender.Female
          ? FEMALE_SIT_FLOOR_OFFSETS[direction]
          : MALE_SIT_FLOOR_OFFSETS[direction];
      break;
    default:
      additionalOffset = STANDING_OFFSETS[direction];
      break;
  }

  screenX += additionalOffset.x;
  screenY += additionalOffset.y;

  const mirrored = [Direction.Right, Direction.Up].includes(
    character.direction,
  );

  if (mirrored) {
    ctx.save(); // Save the current context state
    ctx.translate(GAME_WIDTH, 0); // Move origin to the right edge
    ctx.scale(-1, 1); // Flip horizontally
  }

  const drawX = Math.floor(
    mirrored ? GAME_WIDTH - screenX - bmp.width : screenX,
  );

  ctx.drawImage(bmp, drawX, screenY);

  if (mirrored) {
    ctx.restore();
  }
}
