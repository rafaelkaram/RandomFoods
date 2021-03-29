import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateReceitaIngrediente1615734959254 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'receita_ingrediente',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'quantidade',
                    type: 'decimal',
                    precision: 8,
                    scale: 2,
                    isNullable: true
                },
                {
                    name: 'id_unidade',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'id_ingrediente',
                    type: 'integer'
                },
                {
                    name: 'id_receita',
                    type: 'integer'
                }
            ],
            foreignKeys: [
                {
                    name: 'receitaIngredienteUnidade',
                    columnNames: [ 'id_unidade' ],
                    referencedTableName: 'unidade',
                    referencedColumnNames: [ 'id' ]
                },
                {
                    name: 'receitaIngredienteIngrediente',
                    columnNames: [ 'id_ingrediente' ],
                    referencedTableName: 'ingrediente',
                    referencedColumnNames: [ 'id' ]
                },
                {
                    name: 'receitaIngredienteReceita',
                    columnNames: [ 'id_receita' ],
                    referencedTableName: 'receita',
                    referencedColumnNames: [ 'id' ]
                }
            ],
            uniques: [
                {
                    name: 'receitaIngrediente',
                    columnNames: [ 'id_receita', 'id_ingrediente' ]
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('receita_ingrediente');
    }

}
