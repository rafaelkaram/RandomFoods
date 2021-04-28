import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateCategoria1615734945614 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'categoria',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'nome',
                    type: 'enum',
                    enum: [
                        'DIET',
                        'LIGHT',
                        'FITNESS',
                        'VEGANA',
                        'VEGETARIANA'
                    ]
                },
                {
                    name: 'receita_id',
                    type: 'integer'
                }
            ],
            foreignKeys: [
                {
                    name: 'categoriaReceita',
                    columnNames: [ 'receita_id' ],
                    referencedTableName: 'receita',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('categoria');
    }

}