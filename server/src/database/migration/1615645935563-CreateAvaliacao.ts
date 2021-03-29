import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAvaliacao1615645935563 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'avaliacao',
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
                    name: 'nota',
                    type:  'integer'
                },
                {
                    name: 'data',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'id_usuario',
                    type: 'integer'
                },
                {
                    name: 'id_receita',
                    type: 'integer'
                }
            ],
            foreignKeys: [
                {
                    name: 'avaliacaoUsuario',
                    columnNames: [ 'id_usuario' ],
                    referencedTableName: 'usuario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'avaliacaoReceita',
                    columnNames: [ 'id_receita' ],
                    referencedTableName: 'receita',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                }
            ],
            uniques: [
                {
                    name: 'usuarioReceita',
                    columnNames: [ 'id_usuario', 'id_receita' ]
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('avaliacao');
    }

}
