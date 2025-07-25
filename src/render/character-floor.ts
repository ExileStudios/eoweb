import { type CharacterMapInfo, Direction, Gender } from 'eolib';
import {
  setCharacterRectangle,
  Rectangle,
  getCharacterRectangle,
} from '../collision';
import {
  HALF_CHARACTER_SIT_GROUND_WIDTH,
  CHARACTER_SIT_GROUND_HEIGHT,
  CHARACTER_SIT_GROUND_WIDTH,
} from '../consts';
import { HALF_GAME_WIDTH, HALF_GAME_HEIGHT, GAME_WIDTH } from '../game-state';
import { isoToScreen } from '../utils/iso-to-screen';
import type { Vector2 } from '../vector';
import { getBitmapById, GfxType } from '../gfx';

export function calculateCharacterRenderPositionFloor(
  character: CharacterMapInfo,
  playerScreen: Vector2,
) {
  const screenCoords = isoToScreen(character.coords);

  const additionalOffset = { x: 0, y: 0 };
  switch (character.direction) {
    case Direction.Up:
      additionalOffset.x = 2;
      additionalOffset.y = 11;
      break;
    case Direction.Down:
      additionalOffset.x = -4;
      additionalOffset.y = 8;
      break;
    case Direction.Left:
      additionalOffset.x = -2;
      additionalOffset.y = 12;
      break;
    case Direction.Right:
      additionalOffset.x = 4;
      additionalOffset.y = 8;
      break;
  }

  const screenX = Math.floor(
    screenCoords.x -
      HALF_CHARACTER_SIT_GROUND_WIDTH -
      playerScreen.x +
      HALF_GAME_WIDTH +
      additionalOffset.x,
  );

  const screenY = Math.floor(
    screenCoords.y -
      CHARACTER_SIT_GROUND_HEIGHT -
      playerScreen.y +
      HALF_GAME_HEIGHT +
      additionalOffset.y,
  );

  setCharacterRectangle(
    character.playerId,
    new Rectangle(
      { x: screenX, y: screenY },
      CHARACTER_SIT_GROUND_WIDTH,
      CHARACTER_SIT_GROUND_HEIGHT,
    ),
  );
}

export function renderCharacterFloor(
  character: CharacterMapInfo,
  ctx: CanvasRenderingContext2D,
) {
  const bmp = getBitmapById(GfxType.SkinSprites, 6);
  if (!bmp) {
    return;
  }

  const rect = getCharacterRectangle(character.playerId);
  if (!rect) {
    return;
  }

  const startX =
    character.gender === Gender.Female ? 0 : CHARACTER_SIT_GROUND_WIDTH * 2;
  const sourceX =
    startX +
    ([Direction.Up, Direction.Left].includes(character.direction)
      ? CHARACTER_SIT_GROUND_WIDTH
      : 0);
  const sourceY = character.skin * CHARACTER_SIT_GROUND_HEIGHT;

  const mirrored = [Direction.Right, Direction.Up].includes(
    character.direction,
  );

  if (mirrored) {
    ctx.save(); // Save the current context state
    ctx.translate(GAME_WIDTH, 0); // Move origin to the right edge
    ctx.scale(-1, 1); // Flip horizontally
  }

  const drawX = Math.floor(
    mirrored
      ? GAME_WIDTH - rect.position.x - CHARACTER_SIT_GROUND_WIDTH
      : rect.position.x,
  );

  ctx.drawImage(
    bmp,
    sourceX,
    sourceY,
    CHARACTER_SIT_GROUND_WIDTH,
    CHARACTER_SIT_GROUND_HEIGHT,
    drawX,
    rect.position.y,
    CHARACTER_SIT_GROUND_WIDTH,
    CHARACTER_SIT_GROUND_HEIGHT,
  );

  if (mirrored) {
    ctx.restore();
  }
}
