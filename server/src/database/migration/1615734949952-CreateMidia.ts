import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateMidia1615734949952 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'midia',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'path',
                    type: 'varchar'
                },
                {
                    name: 'tipo',
                    type: 'enum',
                    enum: [ 'FOTO', 'VIDEO' ]
                },
                {
                    name: 'data_cadastro',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'ativa',
                    type: 'boolean',
                    default: true
                },
                {
                    name: 'id_receita',
                    type: 'integer'
                }
            ],
            foreignKeys: [
                {
                    name: 'midiaReceita',
                    columnNames: [ 'id_receita' ],
                    referencedTableName: 'receita',
                    referencedColumnNames: [ 'id' ]
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('midia');
    }

}
