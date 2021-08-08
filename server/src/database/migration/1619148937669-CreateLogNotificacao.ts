import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateLogNotificacao1619148937669 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'log_notificacao',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'usuario_id',
                    type: 'integer',
                },
                {
                    name: 'receita_id',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'seguidor_id',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'comentario_id',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'avaliacao_id',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'curtida_id',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'resposta_id',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'marca_id',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'ativa',
                    type: 'boolean',
                    default: true
                },
                {
                    name: 'visualizada',
                    type: 'boolean',
                    default: false
                },
                {
                    name: 'data',
                    type: 'timestamp',
                    default: 'now()'
                }
            ],
            foreignKeys: [
                {
                    name: 'logNotificacaoUsuario',
                    columnNames: [ 'usuario_id' ],
                    referencedTableName: 'usuario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'logNotificacaoReceita',
                    columnNames: [ 'receita_id' ],
                    referencedTableName: 'receita',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'logNotificacaoSeguidor',
                    columnNames: [ 'seguidor_id' ],
                    referencedTableName: 'seguidor',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'logNotificacaoComentario',
                    columnNames: [ 'comentario_id' ],
                    referencedTableName: 'comentario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'logNotificacaoAvaliacao',
                    columnNames: [ 'avaliacao_id' ],
                    referencedTableName: 'avaliacao',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'logNotificacaoCurtida',
                    columnNames: [ 'curtida_id' ],
                    referencedTableName: 'curtida',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'logNotificacaoResposta',
                    columnNames: [ 'resposta_id' ],
                    referencedTableName: 'comentario',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'logNotificacaoMarca',
                    columnNames: [ 'marca_id' ],
                    referencedTableName: 'marca',
                    referencedColumnNames: [ 'id' ],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('log_notificacao');
    }

}