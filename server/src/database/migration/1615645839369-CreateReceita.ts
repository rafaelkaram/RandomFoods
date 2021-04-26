import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateReceita1615645839369 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'receita',
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
                    type: 'varchar',
                    length: '64',
                    isNullable: true,
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
                    name: 'usuario_id',
                    type: 'integer',
                }
            ],
            foreignKeys: [
                {
                    name: 'receitaUsuario',
                    columnNames: [ 'usuario_id' ],
                    referencedTableName: 'usuario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                }
            ],
            uniques: [
                {
                    name: 'nomeUsuario',
                    columnNames: [ 'nome', 'usuario_id' ]
                }
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('receita');
    }

}