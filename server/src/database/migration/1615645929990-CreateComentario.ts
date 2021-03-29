import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateComentario1615645929990 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'comentario',
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
                    name: 'valor',
                    type: 'text',
                },
                {
                    name: 'data',
                    type: 'timestamp',
                    default: 'now()'
                },
                {
                    name: 'id_pai',
                    type: 'integer',
                    isNullable: true
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
                    name: 'comentarioComentario',
                    columnNames: [ 'id_pai' ],
                    referencedTableName: 'comentario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'comentarioUsuario',
                    columnNames: [ 'id_usuario' ],
                    referencedTableName: 'usuario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'comentarioReceita',
                    columnNames: [ 'id_receita' ],
                    referencedTableName: 'receita',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('comentario');
    }

}
