import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateReceita1615645891939 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'receita',
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
                    name: 'nome',
                    type: 'varchar',
                },
                {
                    name: 'descricao',
                    type: 'text'
                },
                {
                    name: 'tipo',
                    type: 'enum',
                    enum: [ 'DOCE', 'SALGADO' ]
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
                    name: 'id_usuario',
                    type: 'integer',
                }
            ],
            foreignKeys: [
                {
                    name: 'receitaUsuario',
                    columnNames: [ 'id_usuario' ],
                    referencedTableName: 'usuario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                }
            ],
            uniques: [
                {
                    name: 'nomeUsuario',
                    columnNames: [ 'nome', 'id_usuario' ]
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('receita');
    }

}
