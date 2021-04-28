import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateReceitaIngrediente1615734959254 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'receita_ingrediente',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'quantidade',
                    type: 'decimal',
                    precision: 8,
                    scale: 2,
                    isNullable: true
                },
                {
                    name: 'unidade_id',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'ingrediente_id',
                    type: 'integer'
                },
                {
                    name: 'receita_id',
                    type: 'integer'
                }
            ],
            foreignKeys: [
                {
                    name: 'receitaIngredienteUnidade',
                    columnNames: [ 'unidade_id' ],
                    referencedTableName: 'unidade',
                    referencedColumnNames: [ 'id' ]
                },
                {
                    name: 'receitaIngredienteIngrediente',
                    columnNames: [ 'ingrediente_id' ],
                    referencedTableName: 'ingrediente',
                    referencedColumnNames: [ 'id' ]
                },
                {
                    name: 'receitaIngredienteReceita',
                    columnNames: [ 'receita_id' ],
                    referencedTableName: 'receita',
                    referencedColumnNames: [ 'id' ]
                }
            ],
            uniques: [
                {
                    name: 'receitaIngrediente',
                    columnNames: [ 'receita_id', 'ingrediente_id' ]
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('receita_ingrediente');
    }

}