// src/extensions/turboscratch_blocks.js
class TurboScratchBlocks {
    constructor() {
        // Храним состояние для каждого спрайта
        this.spriteStates = new Map();
    }

    getInfo() {
        return {
            id: 'turboscratch_blocks',
            name: 'TurboScratch Super Blocks',
            blocks: [
                {
                    opcode: 'jump10',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Прыгнуть на 10 (если нажать ↑ / Пробел / W)',
                    arguments: {}
                },
                {
                    opcode: 'physicsGravity',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Держаться на [SPRITE] а иначе падать',
                    arguments: {
                        SPRITE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'test_sprite'
                        }
                    }
                },
                {
                    opcode: 'rotate3D',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Повернуть в 3D (если есть арт-точка)',
                    arguments: {}
                }
            ]
        };
    }

    // --- Блок 1: Прыжок ---
    jump10(args, util) {
        const sprite = util.target;
        // Проверяем нажатие клавиш
        const keyPressed = this.isKeyPressed('up arrow') || 
                          this.isKeyPressed('space') || 
                          this.isKeyPressed('w');
        
        if (keyPressed) {
            sprite.y += 10; // Прыжок вверх
            // Анимация прыжка
            sprite.visualY += 10;
        }
    }

    // --- Блок 2: Физика (касание + гравитация) ---
    physicsGravity(args, util) {
        const sprite = util.target;
        const targetSpriteName = args.SPRITE;
        
        // Находим спрайт по имени
        const targetSprite = util.runtime.getSprite(targetSpriteName);
        if (!targetSprite) return;

        // Проверяем касание
        const isTouching = this.checkCollision(sprite, targetSprite);
        
        if (isTouching) {
            // Держимся на спрайте (не падаем)
            sprite.y = targetSprite.y + targetSprite.height / 2 + sprite.height / 2;
        } else {
            // Падаем (гравитация)
            sprite.y -= 2; // Скорость падения
            sprite.visualY -= 2;
        }
    }

    // --- Блок 3: 3D-поворот (если есть арт-точка) ---
    rotate3D(args, util) {
        const sprite = util.target;
        
        // Проверяем, есть ли у спрайта арт-данные (точка на спрайте)
        const hasArtPoint = this.hasArtPoint(sprite);
        
        if (hasArtPoint) {
            // Поворачиваем спрайт в 3D (увеличиваем угол)
            sprite.rotation += 5;
            if (sprite.rotation > 360) sprite.rotation -= 360;
            
            // Визуальный эффект 3D
            sprite.visualRotation = sprite.rotation;
        }
    }

    // --- Вспомогательные методы ---

    isKeyPressed(key) {
        // В реальном коде здесь используется проверка клавиш через scratch-utils
        // Для примера используем заглушку
        const keyMap = {
            'up arrow': 'ArrowUp',
            'space': ' ',
            'w': 'w'
        };
        // В реальном проекте нужно использовать util.io.keyboard.getKeyIsDown()
        return false; // Здесь будет реальная проверка
    }

    checkCollision(spriteA, spriteB) {
        // Упрощённая проверка пересечения прямоугольников
        const aLeft = spriteA.x - spriteA.width / 2;
        const aRight = spriteA.x + spriteA.width / 2;
        const aTop = spriteA.y + spriteA.height / 2;
        const aBottom = spriteA.y - spriteA.height / 2;
        
        const bLeft = spriteB.x - spriteB.width / 2;
        const bRight = spriteB.x + spriteB.width / 2;
        const bTop = spriteB.y + spriteB.height / 2;
        const bBottom = spriteB.y - spriteB.height / 2;
        
        return aLeft < bRight && aRight > bLeft && 
               aBottom < bTop && aTop > bBottom;
    }

    hasArtPoint(sprite) {
        // Проверяем, есть ли у спрайта "арт-точка" (метка)
        // В реальном коде это свойство спрайта
        return sprite.hasOwnProperty('artPoint') && sprite.artPoint === true;
    }
}

// Регистрируем расширение
Scratch.extensions.register(new TurboScratchBlocks());
